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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const fetchArchivedUsers = async (page = 1) => {
    try {
      const response = await axios.get(
        `${server}/users/archived?page=${page}&limit=10`
      );

      const { data, currentPage, totalPages } = response.data;
      setArchivedUsers(data);
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching history leaves:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchArchivedUsers(currentPage);

    // Refresh data every 10 minutes
    const interval = setInterval(() => fetchArchivedUsers(currentPage), 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentPage]);

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
    <div className="p-4 max-w-sm sm:max-w-full">
      <h1 className="page__heading">Archived Users</h1>
      <Table
        columns={columns}
        dataSource={archivedUsers}
        rowKey="_id"
        pagination={false}
        className="user-table overflow-x-auto"
      />

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="py-2 px-4">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ArchivedUsers;
