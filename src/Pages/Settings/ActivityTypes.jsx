import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../main";

const ActivityTypes = () => {
  const [activityTypes, setActivityTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newActivityType, setNewActivityType] = useState({ name: "" });
  const [bulkActivityTypes, setBulkActivityTypes] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${server}/activity-types`);
        if (Array.isArray(response.data)) {
          setActivityTypes(response.data);
        } else {
          console.error("Invalid data format received:", response.data);
        }
      } catch (error) {
        console.error("Error fetching activity types:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivityTypes();
  }, []);

  const filteredActivityTypes = activityTypes.filter((activityType) =>
    activityType.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredActivityTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivityTypes = filteredActivityTypes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEditClick = (activityType) => {
    setNewActivityType({ name: activityType.name });
    setIsEditing(true);
    setShowForm(true);
    setEditId(activityType._id);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this activity type?")) {
      try {
        await axios.delete(`${server}/activity-types/${id}`);
        setActivityTypes(
          activityTypes.filter((activityType) => activityType._id !== id)
        );
      } catch (error) {
        console.error("Error deleting activity type:", error);
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
    setNewActivityType((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulkInputChange = (e) => {
    setBulkActivityTypes(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${server}/activity-types/${editId}`, newActivityType);
        setActivityTypes(
          activityTypes.map((activityType) =>
            activityType._id === editId
              ? { ...activityType, ...newActivityType }
              : activityType
          )
        );
      } else {
        const response = await axios.post(
          `${server}/activity-types`,
          newActivityType
        );
        setActivityTypes([...activityTypes, response.data]);
      }

      setNewActivityType({ name: "" });
      setShowForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    const activityTypesArray = bulkActivityTypes
      .split(",")
      .map((activityType) => activityType.trim())
      .filter((activityType) => activityType);
    try {
      const promises = activityTypesArray.map((activityType) =>
        axios.post(`${server}/activity-types`, { name: activityType })
      );
      const responses = await Promise.all(promises);
      setActivityTypes([...activityTypes, ...responses.map((res) => res.data)]);
      setBulkActivityTypes("");
      setShowBulkForm(false);
    } catch (error) {
      console.error("Error submitting bulk activity types:", error);
    }
  };

  return (
    <div className="p-5">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-3 md:mb-0">Activity Types</h1>
        <div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded mb-2 md:mb-0 md:mr-2"
          >
            New Activity Type +
          </button>
          <button
            onClick={() => setShowBulkForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Bulk Activity Type
          </button>
        </div>
      </div>

      {/* Bulk Activity Type Form Modal */}
      {showBulkForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add Bulk Activity Types</h2>
            <form onSubmit={handleBulkSubmit}>
              <label className="block mb-1">
                Bulk Activity Types (comma-separated):
              </label>
              <input
                type="text"
                value={bulkActivityTypes}
                onChange={handleBulkInputChange}
                className="p-2 border border-gray-300 rounded w-full mb-2"
                placeholder="ActivityType1, ActivityType2..."
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowBulkForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Add Bulk Activity Types
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Individual Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Edit Activity Type" : "Add New Activity Type"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-2">
                <label className="block mb-1">Activity Type Name:*</label>
                <input
                  type="text"
                  name="name"
                  value={newActivityType.name}
                  onChange={handleInputChange}
                  required
                  className="p-2 border border-gray-300 rounded w-full"
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
                  {isEditing ? "Update Activity Type" : "Add Activity Type"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Box */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded w-full sm:w-[80%] md:w-[40%] lg:w-[25%]"
        />
      </div>

      {/* Activity Types List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div
              key={index}
              className="shimmer-card bg-gray-200 rounded-md h-36"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {currentActivityTypes.map((activityType, index) => (
            <div
              key={activityType._id}
              className="relative p-4 shadow-md rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 flex justify-between"
            >
              <p className="text-lg text-gray-700">{activityType.name}</p>
              <button
                onClick={() => handleEllipsisClick(index)}
                className="text-xl focus:outline-none text-gray-700 px-2 absolute right-3 top-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v.01M12 12v.01M12 18v.01"
                  />
                </svg>
              </button>
              {dropdownVisible === index && (
                <div className="absolute top-10 right-3 bg-white shadow-md rounded-md py-1 z-10">
                  <button
                    onClick={() => handleEditClick(activityType)}
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(activityType._id)}
                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )
      }

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`mx-1 px-3 py-1 rounded-md ${currentPage === i + 1
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div >
  );
};

export default ActivityTypes;
