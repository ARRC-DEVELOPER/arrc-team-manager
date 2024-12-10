import React, { useState, useEffect } from "react";
import {
  Modal,
  Select,
  Form,
  Input,
  message,
} from "antd";

import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Components/css/Shimmer.css";
import { server } from "../main";
const Shimmer = () => {
  return (
    <div className="shimmer-container">
      <div className="shimmer-item"></div>
      <div className="shimmer-item"></div>
      <div className="shimmer-item"></div>
    </div>
  );
};

const Clients = ({ loggedInUser }) => {
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [clients, setClients] = useState([]);
  const [form] = Form.useForm();

  const [dropdownIndex, setDropdownIndex] = useState(null);

  const handleDropdownToggle = (index) => {
    setDropdownIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    fetchClients();
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/users`);
      setUsers(
        response.data.map((user) => ({
          ...user,
          password: undefined,
        }))
      );

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch users");
    }
  };

  const fetchClients = async () => {
    const token = localStorage.getItem("authToken");
    setLoading(true);
    try {
      const response = await axios.get(`${server}/users/getAssignedClients`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setClients(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching clients:", error);
      message.error("Failed to fetch clients");
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

  const showModal = (user = null) => {
    setEditingUser(user);
    setVisible(true);
    setFile(null);

    if (user) {
      form.setFieldsValue({
        ...user,
        isActive: user.isActive,
        department: user.department?._id || null,
        role: user.role?._id || null,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        name: '',
        email: '',
        phone: '',
        password: '',
        department: null,
        role: null,
        isActive: true,
      });
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
    formData.append("department", values.department);
    formData.append("role", "674e9f60d80e2f15f1da864f");

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
      fetchClients();
      handleCancel();
    } catch (error) {
      message.error(
        "Failed to save user: " + (error.response?.data?.message || "unknown error")
      );
    }
  };

  const handleInputChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setEditingUser(null);
    form.resetFields();
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

  const filteredUsers = users.filter((user) => {
    return user.role.name == "Client";
  });

  return (
    <div className="p-5">
      <ToastContainer />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clients</h1>
        {
          loggedInUser?.role?.name == "Admin" || loggedInUser?.role?.name == "Manager" ? (
            <button
              onClick={() => showModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded transition hover:bg-blue-700"
            >
              Add Client
            </button>
          ) : (
            <></>
          )
        }
      </div>

      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <Shimmer />
        ) : (
          clients.length > 0 ? (
            clients.map((client, index) => (
              <div
                key={index}
                className="bg-white p-4 border rounded shadow-md hover:shadow-lg transition relative"
              >
                <h2 className="font-semibold">{client.name}</h2>
                <p>Department: {client?.department?.name}</p>
                <p>Email: {client.email}</p>
                <p>
                  Website:{" "}
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {client.website}
                  </a>
                </p>
                {client.profileImage && (
                  <img
                    src={client.profileImage}
                    alt={`${client.name}'s profile`}
                    className="mt-2 rounded-full w-20 h-20 object-cover"
                  />
                )}

                {
                  loggedInUser?.role?.name == "Admin" || loggedInUser?.role?.name == "Manager" ? (
                    <button
                      className="absolute top-2 right-2 text-gray-600 focus:outline-none"
                      onClick={() => handleDropdownToggle(index)}
                    >
                      ⋮
                    </button>
                  ) : (
                    <></>
                  )
                }

                {dropdownIndex === index && (
                  <div className="absolute top-10 right-2 bg-white border rounded shadow-md z-10">
                    <button
                      onClick={() => showModal(client)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleArchiveUser(client._id)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No clients available.</p>
          )
        )}
      </div>

      <Modal
        title={editingUser ? "Edit Client" : "New Client"}
        visible={visible}
        onOk={() => form.validateFields().then(handleOk).catch(console.log)}
        onCancel={handleCancel}
        okText={editingUser ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical" initialValues={{}}>
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

          <Form.Item label="Profile Picture">
            <input type="file" onChange={handleInputChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Clients;
