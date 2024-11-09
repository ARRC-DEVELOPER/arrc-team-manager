import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../main";

const Taxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newTax, setNewTax] = useState({ name: "", rate: "" });
  const [bulkTaxes, setBulkTaxes] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 12;

  // Fetch taxes from the backend
  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${server}/taxes`);
        if (Array.isArray(response.data)) {
          setTaxes(response.data);
        } else {
          console.error("Invalid data format received:", response.data);
        }
      } catch (error) {
        console.error("Error fetching taxes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTaxes();
  }, []);

  const filteredTaxes = taxes.filter((tax) =>
    tax.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTaxes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTaxes = filteredTaxes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEditClick = (tax) => {
    setNewTax({ name: tax.name, rate: tax.rate });
    setIsEditing(true);
    setShowForm(true);
    setEditId(tax._id);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this tax type?")) {
      try {
        await axios.delete(`${server}/taxes/${id}`);
        setTaxes(taxes.filter((tax) => tax._id !== id));
      } catch (error) {
        console.error("Error deleting tax type:", error);
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
    setNewTax((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulkInputChange = (e) => {
    setBulkTaxes(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${server}/taxes/${editId}`, newTax);
        setTaxes(
          taxes.map((tax) => (tax._id === editId ? { ...tax, ...newTax } : tax))
        );
      } else {
        const response = await axios.post(`${server}/taxes`, newTax);
        setTaxes([...taxes, response.data]);
      }

      setNewTax({ name: "", rate: "" });
      setShowForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    const taxesArray = bulkTaxes
      .split(",")
      .map((tax) => tax.trim())
      .filter((tax) => tax);
    try {
      const promises = taxesArray.map((tax) => {
        const [name, rate] = tax.split(":");
        return axios.post(`${server}/taxes`, {
          name: name.trim(),
          rate: parseFloat(rate.trim()),
        });
      });
      const responses = await Promise.all(promises);
      setTaxes([...taxes, ...responses.map((res) => res.data)]);
      setBulkTaxes("");
      setShowBulkForm(false);
    } catch (error) {
      console.error("Error submitting bulk taxes:", error);
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Tax Types</h1>
        <div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
          >
            New Tax Type +
          </button>
          <button
            onClick={() => setShowBulkForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Bulk Tax Type
          </button>
        </div>
      </div>

      {/* Bulk Tax Type Form Modal */}
      {showBulkForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add Bulk Tax Types</h2>
            <form onSubmit={handleBulkSubmit}>
              <label className="block mb-1">
                Bulk Tax Types (comma-separated, format: Name:Rate):
              </label>
              <input
                type="text"
                value={bulkTaxes}
                onChange={handleBulkInputChange}
                className="p-2 border border-gray-300 rounded w-full mb-2"
                placeholder="Tax1:10, Tax2:15..."
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
                  Add Bulk Tax Types
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
              {isEditing ? "Edit Tax Type" : "Add New Tax Type"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-2">
                <label className="block mb-1">Tax Name:*</label>
                <input
                  type="text"
                  name="name"
                  value={newTax.name}
                  onChange={handleInputChange}
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Tax Rate (%):*</label>
                <input
                  type="number"
                  name="rate"
                  value={newTax.rate}
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
                  {isEditing ? "Update Tax Type" : "Add Tax Type"}
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
          {currentTaxes.map((tax, index) => (
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
                      onClick={() => handleEditClick(tax)}
                    >
                      Edit
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-right"
                      onClick={() => handleDeleteClick(tax._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <h2 className="text-lg font-semibold">{tax.name}</h2>
              <p className="text-sm">Rate: {tax.rate}%</p>
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
        {Math.min(startIndex + itemsPerPage, filteredTaxes.length)} of{" "}
        {filteredTaxes.length}
      </p>
    </div>
  );
};

export default Taxes;
