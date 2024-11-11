import React, { useState, useEffect } from "react";
import { Button, Modal, Select, Table, Switch, message } from "antd";
import axios from "axios";
import { server } from "../main";
import { useNavigate } from "react-router-dom";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";

const { Option } = Select;

const ArchivedUsers = () => {
  const [archivedUsers, setArchivedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArchivedUsers();
  }, []);

  const fetchArchivedUsers = async () => {
    try {
      const response = await axios.get(`${server}/users/archived`);
      setArchivedUsers(response.data);
    } catch (error) {
      message.error("Failed to fetch archived users");
    }
  };

  const handleUnarchive = async (userId) => {
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
      message.success("User unarchived successfully");
      fetchArchivedUsers();
    } catch (error) {
      message.error("Failed to unarchive user");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <a onClick={() => navigate(`/user/${record._id}`)}>{text}</a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => (
        <div className="flex items-center text-gray-600">
          <MailOutlined className="mr-1" />
          {email}
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (phone) => (
        <div className="flex items-center text-gray-600">
          <PhoneOutlined className="mr-1" />
          {phone}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive) => <Switch checked={isActive} disabled />,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => handleUnarchive(record._id)} type="primary">
          Unarchive
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="page__heading">Archived Users</h1>
      <Table
        columns={columns}
        dataSource={archivedUsers}
        rowKey="_id"
        pagination={false}
        className="user-table"
      />
    </div>
  );
};

export default ArchivedUsers;
