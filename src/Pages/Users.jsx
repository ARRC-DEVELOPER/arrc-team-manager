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
  const [projects, setProjects] = useState([]);
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchProjects();
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

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${server}/projects`);
      setProjects(response.data);
    } catch (error) {
      message.error("Failed to fetch projects");
    }
  };

  const showModal = (user = null) => {
    setEditingUser(user);
    setVisible(true);
    setFile(null); // Reset file when opening the modal
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
    formData.append("project", values.project);
    formData.append("salary", values.salary);
    formData.append("isActive", values.isActive);

    formData.append("status", values.isActive ? "active" : "inactive");

    if (file) {
      formData.append("profilePicture", file);
    }

    try {
      const response = editingUser
        ? await axios.put(`${server}/users/${editingUser._id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await axios.post(`${server}/users`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      message.success(
        editingUser ? "User updated successfully" : "User created successfully"
      );
      fetchUsers();
      handleCancel();
    } catch (error) {
      message.error(
        "Failed to save user: " +
          (error.response?.data?.message || "unknown error")
      );
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setEditingUser(null);
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
    const token = localStorage.getItem("authToken");

    try {
      await axios.put(
        `${server}/users/archive/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
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

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    return project ? project.name : "Unknown Project";
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
                  {getProjectName(user.project)}
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
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          onFinish={handleOk}
          layout="vertical"
          initialValues={editingUser}
          className="space-y-3"
        >
          <Form.Item name="name" label="Name" required>
            <Input placeholder="Enter name" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item name="email" label="Email" required>
            <Input
              type="email"
              placeholder="Enter email"
              prefix={<MailOutlined />}
            />
          </Form.Item>
          <Form.Item name="phone" label="Phone" required>
            <Input placeholder="Enter phone" prefix={<PhoneOutlined />} />
          </Form.Item>
          <Form.Item name="salary" label="Salary">
            <Input type="number" placeholder="Enter salary" />
          </Form.Item>
          {!editingUser && (
            <Form.Item name="password" label="Password" required>
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}
          <Form.Item name="role" label="Role" required>
            <Select placeholder="Select role">
              {roles.map((role) => (
                <Option key={role._id} value={role._id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="project" label="Project">
            <Select placeholder="Select project">
              {projects.map((project) => (
                <Option key={project._id} value={project._id}>
                  {project.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="isActive" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          <Form.Item name="profilePicture" label="Profile Picture">
            <Input type="file" onChange={handleInputChange} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
