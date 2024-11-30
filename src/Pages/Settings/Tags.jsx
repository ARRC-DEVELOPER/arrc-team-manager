import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../main";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newTag, setNewTag] = useState({ name: "" });
  const [bulkTags, setBulkTags] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [loading, setLoading] = useState(true); // For shimmer effect

  const itemsPerPage = 12;

  // Fetch tags from the backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true); // Start shimmer effect
        const response = await axios.get(`${server}/tags`);
        if (Array.isArray(response.data)) {
          setTags(response.data);
        } else {
          console.error("Invalid data format received:", response.data);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false); // End shimmer effect
      }
    };
    fetchTags();
  }, []);

  const filteredTags = tags.filter((tag) =>
    tag.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTags = filteredTags.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEditClick = (tag) => {
    setNewTag({ name: tag.name });
    setIsEditing(true);
    setShowForm(true);
    setEditId(tag._id);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      try {
        await axios.delete(`${server}/tags/${id}`);
        setTags(tags.filter((tag) => tag._id !== id));
      } catch (error) {
        console.error("Error deleting tag:", error);
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
    setNewTag((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulkInputChange = (e) => {
    setBulkTags(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${server}/tags/${editId}`, newTag);
        setTags(
          tags.map((tag) => (tag._id === editId ? { ...tag, ...newTag } : tag))
        );
      } else {
        const response = await axios.post(`${server}/tags`, newTag);
        setTags([...tags, response.data]);
      }

      setNewTag({ name: "" });
      setShowForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = bulkTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    try {
      const promises = tagsArray.map((tag) =>
        axios.post(`${server}/tags`, {
          name: tag,
        })
      );
      const responses = await Promise.all(promises);
      setTags([...tags, ...responses.map((res) => res.data)]);
      setBulkTags(""); // Clear the bulk input after submission
      setShowBulkForm(false); // Close the bulk form after submission
    } catch (error) {
      console.error("Error submitting bulk tags:", error);
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl lg:text-3xl font-bold">Tags</h1>
        <div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
          >
            New Tag +
          </button>
          <button
            onClick={() => setShowBulkForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Bulk Tag
          </button>
        </div>
      </div>

      {/* Bulk Tag Form Modal */}
      {showBulkForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add Bulk Tags</h2>
            <form onSubmit={handleBulkSubmit}>
              <label className="block mb-1">Bulk Tags (comma-separated):</label>
              <input
                type="text"
                value={bulkTags}
                onChange={handleBulkInputChange}
                className="p-2 border border-gray-300 rounded w-full mb-2"
                placeholder="Tag1, Tag2, Tag3..."
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
                  Add Bulk Tags
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Edit Tag" : "Add New Tag"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-2">
                <label className="block mb-1">Tag Name:*</label>
                <input
                  type="text"
                  name="name"
                  value={newTag.name}
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
                  {isEditing ? "Update Tag" : "Add Tag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded w-full sm:w-1/2 lg:w-1/4"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div
              key={index}
              className="shimmer-card bg-gray-200 rounded-md h-36"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentTags.map((tag, index) => (
            <div
              key={index}
              className="relative bg-white p-6 mt-3 border rounded shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute top-2 right-2">
                <button onClick={() => handleEllipsisClick(index)}>
                  &#x22EE;
                </button>
                {dropdownVisible === index && (
                  <div className="absolute top-8 right-0 bg-white border rounded shadow p-2 z-10">
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleEditClick(tag)}
                    >
                      Edit
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleDeleteClick(tag._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <h2 className="text-lg font-bold">{tag.name}</h2>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <nav>
          <ul className="inline-flex items-center">
            {Array.from({ length: totalPages }).map((_, index) => (
              <li
                key={index}
                className={`mx-1 px-3 py-1 border rounded cursor-pointer ${currentPage === index + 1 ? "bg-blue-600 text-white" : ""
                  }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Tags;
