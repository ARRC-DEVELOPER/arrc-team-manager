import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "../Components/css/Shimmer.css";
import { server } from "../main";
import {
  Button,
  Menu,
  Dropdown,
  Modal,
  Input,
} from "antd";
import {
  EllipsisOutlined,
} from "@ant-design/icons";

const Departments = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    color: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 12;

  console.log(newDepartment);

  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${server}/departments`);
      if (Array.isArray(response.data)) {
        setDepartments(response.data);
      } else {
        console.error("Invalid data format received:", response.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false); // End shimmer effect
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter((department) =>
    department.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDepartments = filteredDepartments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEditClick = (department) => {
    setNewDepartment({
      name: department.name,
      color: department.color,
      description: department.description,
    });
    setIsEditing(true);
    setEditId(department._id);
    setIsModalVisible(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`${server}/departments/${id}`);
        setDepartments(
          departments.filter((department) => department._id !== id)
        );
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setNewDepartment((prev) => ({ ...prev, description: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${server}/departments/${editId}`, newDepartment);
        setDepartments(
          departments.map((department) =>
            department._id === editId
              ? { ...department, ...newDepartment }
              : department
          )
        );
        fetchDepartments();
      } else {
        const response = await axios.post(
          `${server}/departments`,
          newDepartment
        );
        setDepartments([...departments, response.data]);
        fetchDepartments();
      }

      setNewDepartment({ name: "", color: "", description: "" });
      setIsModalVisible(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-5">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-2 sm:mb-0">Departments</h1>
        <button
          onClick={() => {
            setIsEditing(false);
            setIsModalVisible(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          New Department +
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded w-full sm:w-[50%] md:w-[30%] lg:w-[20%]"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="shimmer-card rounded-md h-36"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {currentDepartments.map((department, index) => (
            <div
              key={index}
              style={{ borderTopColor: department.color }}
              className="relative bg-white p-4 border-t-4 border-gray-300 rounded shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute top-2 right-2">
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        onClick={() => handleEditClick(department)}
                        className="hover:bg-gray-200"
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => handleDeleteClick(department._id)}
                        className="hover:bg-gray-200"
                      >
                        Delete
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={["click"]}
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  <Button
                    className="text-gray-600 hover:text-blue-500"
                    type="link"
                    icon={<EllipsisOutlined />}
                  />
                </Dropdown>
              </div>

              <h2 className="text-lg font-semibold">{department.name}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: department.description }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-center space-x-2">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-2 border rounded border-gray-300 hover:bg-gray-100"
          >
            Previous
          </button>
        )}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-2 mx-1 border rounded ${currentPage === index + 1
              ? "bg-blue-600 text-white"
              : "border-gray-300 hover:bg-gray-100"
              }`}
          >
            {index + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-2 border rounded border-gray-300 hover:bg-gray-100"
          >
            Next
          </button>
        )}
      </div>

      <p className="mt-4 text-center">
        Showing {startIndex + 1} -{" "}
        {Math.min(startIndex + itemsPerPage, filteredDepartments.length)} of{" "}
        {filteredDepartments.length}
      </p>

      <Modal
        title={isEditing ? "Edit Department" : "Add Department"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null} // Remove default buttons
      >
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="name">Name:</label>
          <Input
            placeholder="Name"
            name="name"
            value={newDepartment.name}
            onChange={handleInputChange}
            className="mb-3"
          />

          <label htmlFor="color">Choose Color:</label>
          <Input
            type="color"
            name="color"
            value={newDepartment.color}
            onChange={handleInputChange}
            className="mb-3"
          />

          <ReactQuill
            value={newDepartment.description}
            onChange={handleDescriptionChange}
            className="mb-3"
          />

          <div className="flex justify-end">
            <Button onClick={() => setIsModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;
