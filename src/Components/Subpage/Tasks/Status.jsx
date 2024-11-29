import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../../main";

const Status = () => {
  const [statuses, setStatuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newStatus, setNewStatus] = useState({ name: "", order: "" });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 12;

  // Fetch statuses from the backend
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${server}/statuses`);
        if (Array.isArray(response.data)) {
          setStatuses(response.data);
        } else {
          console.error("Invalid data format received:", response.data);
        }
      } catch (error) {
        console.error("Error fetching statuses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatuses();
  }, []);

  const filteredStatuses = statuses.filter((status) =>
    status.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStatuses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStatuses = filteredStatuses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEditClick = (status) => {
    setNewStatus({
      name: status.name,
      order: status.order,
    });
    setIsEditing(true);
    setShowForm(true);
    setEditId(status._id);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this status?")) {
      try {
        await axios.delete(`${server}/statuses/${id}`);
        setStatuses(statuses.filter((status) => status._id !== id));
      } catch (error) {
        console.error("Error deleting status:", error);
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
    setNewStatus((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `${server}/statuses/${editId}`,
          newStatus
        );
        setStatuses(
          statuses.map((status) =>
            status._id === editId ? { ...status, ...newStatus } : status
          )
        );
      } else {
        const response = await axios.post(
          `${server}/statuses`,
          newStatus
        );
        setStatuses([...statuses, response.data]);
      }

      setNewStatus({ name: "", order: "" });
      setShowForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Status</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          New Status +
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded w-full sm:w-[40%] md:w-[30%] lg:w-[20%]"
        />
      </div>

      {/* SHIMMER EFFECT */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="shimmer-card rounded-md h-36"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentStatuses.map((status, index) => (
            <div
              key={index}
              className="relative bg-white p-4 border rounded shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute top-2 right-2">
                <button onClick={() => handleEllipsisClick(index)}>
                  &#x22EE;
                </button>

                {dropdownVisible === index && (
                  <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded shadow-lg">
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-right"
                      onClick={() => handleEditClick(status)}
                    >
                      Edit
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-right"
                      onClick={() => handleDeleteClick(status._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <h2 className="text-lg font-semibold">{status.name}</h2>
              <p>Order: {status.order}</p>
              <p>Count: {status.count}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-center sm:justify-start w-full">
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

      <p className="mt-4 text-center">
        Showing {startIndex + 1} -{" "}
        {Math.min(startIndex + itemsPerPage, filteredStatuses.length)} of{" "}
        {filteredStatuses.length}
      </p>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Edit Status" : "Add New Status"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-2">
                <label className="block mb-1">Name:*</label>
                <input
                  type="text"
                  name="name"
                  value={newStatus.name}
                  onChange={handleInputChange}
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Order:*</label>
                <input
                  type="number"
                  name="order"
                  value={newStatus.order}
                  onChange={handleInputChange}
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {isEditing ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="ml-2 px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;
