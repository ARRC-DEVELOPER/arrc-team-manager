import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ActivityTypes = () => {
  const [activityTypes, setActivityTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newActivityType, setNewActivityType] = useState({ name: '' });
  const [bulkActivityTypes, setBulkActivityTypes] = useState(''); // State for bulk activity types input
  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false); // State to show bulk form
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [loading, setLoading] = useState(true); // For shimmer effect

  const itemsPerPage = 12;

  // Fetch activity types from the backend
  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        setLoading(true); // Start shimmer effect

        const response = await axios.get('https://task-manager-backend-btas.onrender.com/api/activity-types');
        if (Array.isArray(response.data)) {
          setActivityTypes(response.data);
        } else {
          console.error('Invalid data format received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching activity types:', error);
      } finally {
        setLoading(false); // End shimmer effect
      }
    };
    fetchActivityTypes();
  }, []);

  const filteredActivityTypes = activityTypes.filter(activityType =>
    activityType.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredActivityTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivityTypes = filteredActivityTypes.slice(startIndex, startIndex + itemsPerPage);

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
    if (window.confirm('Are you sure you want to delete this activity type?')) {
      try {
        await axios.delete(`https://task-manager-backend-btas.onrender.com/api/activity-types/${id}`);
        setActivityTypes(activityTypes.filter(activityType => activityType._id !== id));
      } catch (error) {
        console.error('Error deleting activity type:', error);
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
        await axios.put(`https://task-manager-backend-btas.onrender.com/api/activity-types/${editId}`, newActivityType);
        setActivityTypes(activityTypes.map((activityType) => (activityType._id === editId ? { ...activityType, ...newActivityType } : activityType)));
      } else {
        const response = await axios.post('https://task-manager-backend-btas.onrender.com/api/activity-types', newActivityType);
        setActivityTypes([...activityTypes, response.data]);
      }

      setNewActivityType({ name: '' });
      setShowForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    const activityTypesArray = bulkActivityTypes.split(',').map(activityType => activityType.trim()).filter(activityType => activityType);
    try {
      const promises = activityTypesArray.map(activityType => axios.post('https://task-manager-backend-btas.onrender.com/api/activity-types', { name: activityType }));
      const responses = await Promise.all(promises);
      setActivityTypes([...activityTypes, ...responses.map(res => res.data)]);
      setBulkActivityTypes(''); // Clear the bulk input after submission
      setShowBulkForm(false); // Close the bulk form after submission
    } catch (error) {
      console.error('Error submitting bulk activity types:', error);
    }
  };

  return (
    <>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Activity Types</h1>
          <div>
            <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded mr-2">
              New Activity Type +
            </button>
            <button onClick={() => setShowBulkForm(true)} className="px-4 py-2 bg-green-600 text-white rounded">
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
                <label className="block mb-1">Bulk Activity Types (comma-separated):</label>
                <input
                  type="text"
                  value={bulkActivityTypes}
                  onChange={handleBulkInputChange}
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                  placeholder="ActivityType1, ActivityType2, ActivityType3..."
                />
                <div className="flex justify-between">
                  <button type="button" onClick={() => setShowBulkForm(false)} className="px-4 py-2 border border-gray-300 rounded">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                    Add Bulk Activity Types
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-bold mb-4">{isEditing ? 'Edit Activity Type' : 'Add New Activity Type'}</h2>
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
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    {isEditing ? 'Update Activity Type' : 'Add Activity Type'}
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
            {currentActivityTypes.map((activityType, index) => (
              <div key={index} className="relative bg-white  p-6 mt-3 border rounded shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="absolute top-2 right-2">
                  <button onClick={() => handleEllipsisClick(index)}>
                    &#x22EE;
                  </button>

                  {dropdownVisible === index && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded shadow-lg">
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-right"
                        onClick={() => handleEditClick(activityType)}
                      >
                        Edit
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-right"
                        onClick={() => handleDeleteClick(activityType._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <h2 className="text-lg font-semibold">{activityType.name}</h2>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end w-full">
          {currentPage > 1 && (
            <button onClick={() => handlePageChange(currentPage - 1)} className="px-3 py-2 mx-1 border rounded border-gray-300 hover:bg-gray-100">
              Previous
            </button>
          )}
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-2 mx-1 border rounded ${
                currentPage === index + 1 ? 'bg-blue-600 text-white' : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              {index + 1}
            </button>
          ))}
          {currentPage < totalPages && (
            <button onClick={() => handlePageChange(currentPage + 1)} className="px-3 py-2 mx-1 border rounded border-gray-300 hover:bg-gray-100">
              Next
            </button>
          )}
        </div>

        <p className="mt-4">
          Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredActivityTypes.length)} of {filteredActivityTypes.length}
        </p>
      </div>
    </>
  );
};

export default ActivityTypes;
