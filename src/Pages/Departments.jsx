import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
import axios from "axios";
import "../Components/css/Shimmer.css"; // For shimmer effect
import { server } from "../main";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    color: "",
    description: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [loading, setLoading] = useState(true); // For shimmer effect

  const itemsPerPage = 12;

  // Fetch departments from the backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true); // Start shimmer effect

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
    setShowForm(true);
    setEditId(department._id);
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

  const handleEllipsisClick = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
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
      } else {
        const response = await axios.post(
          `${server}/departments`,
          newDepartment
        );
        setDepartments([...departments, response.data]);
      }

      setNewDepartment({ name: "", color: "", description: "" });
      setShowForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Departments</h1>
          <button
            onClick={() => setShowForm(true)}
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
            className="p-2 border border-gray-300 rounded w-[18%] sm:w-[40%] md:w-[25%] lg:w-[18%]"
          />
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <div key={index} className="shimmer-card rounded-md h-36"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentDepartments.map((department, index) => (
              <div
                key={index}
                style={{ borderTopColor: department.color }}
                className="relative bg-white p-4 border-t-4 border-gray-300 rounded shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="absolute top-2 right-2">
                  <button onClick={() => handleEllipsisClick(index)}>
                    &#x22EE;
                  </button>

                  {dropdownVisible === index && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded shadow-lg">
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-right"
                        onClick={() => handleEditClick(department)}
                      >
                        Edit
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-right"
                        onClick={() => handleDeleteClick(department._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <h2 className="text-lg font-semibold">{department.name}</h2>
                <div
                  dangerouslySetInnerHTML={{ __html: department.description }}
                />
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex justify-end w-full">
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-2 mx-1 border rounded border-gray-300 hover:bg-gray-100"
            >
              Previous
            </button>
          )}
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-2 mx-1 border rounded ${
                currentPage === index + 1
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
              className="px-3 py-2 mx-1 border rounded border-gray-300 hover:bg-gray-100"
            >
              Next
            </button>
          )}
        </div>

        <p className="mt-4">
          Showing {startIndex + 1} -{" "}
          {Math.min(startIndex + itemsPerPage, filteredDepartments.length)} of{" "}
          {filteredDepartments.length}
        </p>

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-bold mb-4">
                {isEditing ? "Edit Department" : "Add New Department"}
              </h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-2">
                  <label className="block mb-1">Name:*</label>
                  <input
                    type="text"
                    name="name"
                    value={newDepartment.name}
                    onChange={handleInputChange}
                    required
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1">Color:</label>
                  <input
                    type="color"
                    name="color"
                    value={newDepartment.color}
                    onChange={handleInputChange}
                    className="rounded w-16 h-10 focus:border-2 focus:border-gray-500"
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1">Description:</label>
                  <ReactQuill
                    value={newDepartment.description}
                    onChange={handleDescriptionChange}
                    className="p-2 border border-gray-300 rounded w-full"
                    placeholder="Add Department description..."
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    {isEditing ? "Update Department" : "Add Department"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Departments;
