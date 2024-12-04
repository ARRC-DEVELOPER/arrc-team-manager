import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Select,
  Form,
  Input,
  Menu,
  Dropdown,
  Switch,
  message,
} from "antd";
import axios from "axios";
import { server } from "../main";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const Users = () => {
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState("all");
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${server}/users`);
      setUsers(
        response.data.map((user) => ({
          ...user,
          password: undefined,
        }))
      );
    } catch (error) {
      message.error("Failed to fetch users");
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${server}/roles`);
      setRoles(response.data);
    } catch (error) {
      message.error("Failed to fetch roles");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${server}/departments`);
      setDepartments(response.data);
    } catch (error) {
      message.error("Failed to fetch departments");
    }
  };

  const showModal = (user) => {
    setEditingUser(user);
    setVisible(true);
    setFile(null);
    if (user) {
      form.setFieldsValue({
        ...user,
        isActive: user.isActive,
        department: user.department?._id,
        role: user.role?._id,
      });
    } else {
      form.resetFields();
    }
  };

  const handleOk = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    if (!editingUser) {
      formData.append("password", values.password);
    }
    formData.append("role", values.role);
    formData.append("department", values.department);
    formData.append("salary", values.salary);
    formData.append("isActive", values.isActive);
    formData.append("status", values.isActive ? "active" : "inactive");

    if (file) {
      formData.append("profilePicture", file);
    }

    try {
      const response = editingUser
        ? await axios.put(`${server}/users/${editingUser._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        : await axios.post(`${server}/users`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      message.success(
        editingUser ? "User updated successfully" : "User created successfully"
      );
      fetchUsers();
      handleCancel();
    } catch (error) {
      message.error(
        "Failed to save user: " + (error.response?.data?.message || "unknown error")
      );
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${server}/users/${userId}`);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleArchiveUser = async (userId) => {
    try {
      await axios.put(
        `${server}/users/archive/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );
      message.success("User archived successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to archive user");
    }
  };

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    return filter === "1" ? user.isActive : !user.isActive;
  });

  const handleInputChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r._id === roleId);
    return role ? role.name : "Unknown Role";
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((p) => p._id === departmentId);
    return department ? department.name : "Unknown Department";
  };

  return (
    <div className="p-4">
      <h1 className="page__heading">Users</h1>
      <div className="flex justify-end items-center space-x-4 mb-4">
        <Select
          onChange={handleFilterChange}
          style={{ width: "200px", marginRight: "16px" }}
          placeholder="Filter Users"
        >
          <Option value="all">All</Option>
          <Option value="1">Active</Option>
          <Option value="0">Inactive</Option>
        </Select>
        <Button type="primary" onClick={() => showModal()}>
          New User <i className="fas fa-plus"></i>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            className="bg-white shadow-md rounded-lg overflow-hidden user-card-view hover:shadow-lg transition-shadow duration-300 ease-in-out"
            key={user._id}
          >
            <div className="flex items-center p-4 border-b">
              <div className="mr-3">
                <img
                  onClick={() => navigate(`/user/${user._id}`)}
                  alt="avatar"
                  width="50"
                  src={
                    user.profilePicture ||
                    `https://ui-avatars.com/api/?name=${user.name}&size=64&rounded=true&color=fff&background=42c9af`
                  }
                  className="cursor-pointer rounded-full"
                />
                <label
                  className="custom-switch pl-0"
                  title={user.isActive ? "Active" : "Inactive"}
                >
                  <input
                    type="checkbox"
                    className="custom-switch-input is-active"
                    checked={user.isActive}
                    readOnly
                  />
                  <span className="custom-switch-indicator"></span>
                </label>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4
                    onClick={() => navigate(`/user/${user._id}`)}
                    className="cursor-pointer font-semibold text-lg text-gray-800"
                  >
                    {user.name}
                  </h4>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item
                          onClick={() => showModal(user)}
                          className="hover:bg-gray-200"
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => handleArchiveUser(user._id)}
                          className="hover:bg-gray-200"
                        >
                          Archive
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => handleDelete(user._id)}
                          className="hover:bg-gray-200"
                        >
                          Delete
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={["click"]}
                    getPopupContainer={(trigger) => trigger.parentNode} // To avoid dropdown clipping issues
                  >
                    <Button
                      className="text-gray-600 hover:text-blue-500"
                      type="link"
                      icon={<EllipsisOutlined />}
                    />
                  </Dropdown>
                </div>
                <div className="text-gray-500">{getRoleName(user.role)}</div>
                <div className="text-gray-600 flex items-center">
                  <MailOutlined className="mr-1" />
                  {user.email}
                </div>
                <div className="text-gray-600 flex items-center">
                  <PhoneOutlined className="mr-1" />
                  {user.phone}
                </div>
              </div>
            </div>
            <div className="flex p-4 border-t">
              <div className="mr-3">
                <span className="bg-blue-500 text-white px-2 py-1 rounded">
                  {getDepartmentName(user.department)}
                </span>
              </div>
              <div>
                <span className="bg-gray-800 text-white px-2 py-1 rounded">
                  {user.ongoingTaskCount || 0}
                </span>{" "}
                Tasks Active
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={editingUser ? "Edit User" : "New User"}
        visible={visible}
        onOk={() => form.validateFields().then(handleOk).catch(console.log)}
        onCancel={handleCancel}
        okText={editingUser ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please input the phone" }]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input the password" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select Role">
              {roles.map((role) => (
                <Option key={role._id} value={role._id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: "Please select a department" }]}
          >
            <Select placeholder="Select Department">
              {departments.map((department) => (
                <Option key={department._id} value={department._id}>
                  {department.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="salary"
            label="Salary"
            rules={[{ required: true, message: "Please input the salary" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Profile Picture">
            <input type="file" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Active Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
