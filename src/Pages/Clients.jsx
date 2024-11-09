import React, { useState, useEffect } from "react";
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

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    department: "",
    email: "",
    website: "",
    profileImage: null,
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const fetchClients = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get(
        `${server}/clients`
      );
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Error fetching clients. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${server}/departments`
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Error fetching departments. Please try again later.");
    }
  };

  useEffect(() => {
    fetchClients();
    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in newClient) {
      formData.append(key, newClient[key]);
    }

    try {
      if (newClient._id) {
        const response = await axios.put(
          `${server}/clients/${newClient._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setClients(
          clients.map((client) =>
            client._id === newClient._id ? response.data : client
          )
        );
        toast.success("Client updated successfully!");
      } else {
        const response = await axios.post(
          `${server}/clients`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setClients([...clients, response.data]);
        toast.success("Client added successfully!");
      }

      setNewClient({
        name: "",
        department: "",
        email: "",
        website: "",
        profileImage: null,
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Error saving client. Please try again later.");
    }
  };

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleEdit = (clientId) => {
    const clientToEdit = clients.find((client) => client._id === clientId);
    setNewClient(clientToEdit);
    setShowForm(true);
  };

  const handleDelete = async (clientId) => {
    try {
      await axios.delete(
        `${server}/clients/${clientId}`
      );
      setClients(clients.filter((client) => client._id !== clientId));
      toast.success("Client deleted successfully!");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Error deleting client. Please try again later.");
    }
  };

  return (
    <div className="p-5">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded transition hover:bg-blue-700"
        >
          Add Client
        </button>
      </div>

      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <Shimmer /> // Show shimmer effect while loading
        ) : (
          clients.map((client, index) => (
            <div
              key={index}
              className="bg-white p-4 border rounded shadow-md hover:shadow-lg transition relative"
            >
              <h2 className="font-semibold">{client.name}</h2>
              <p>Department: {client.department}</p>
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
              <button
                className="absolute top-2 right-2 text-gray-600 focus:outline-none"
                onClick={() => handleDropdownToggle(index)}
              >
                ⋮
              </button>
              {activeDropdown === index && (
                <div className="absolute top-10 right-2 bg-white border rounded shadow-md z-10">
                  <button
                    onClick={() => handleEdit(client._id)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto shadow-lg">
            <h2 className="text-lg font-bold mb-4">New Client</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-2">
                <label className="block mb-1">Name:*</label>
                <input
                  type="text"
                  name="name"
                  value={newClient.name}
                  onChange={handleInputChange}
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Department:*</label>
                <select
                  name="department"
                  value={newClient.department}
                  onChange={handleInputChange}
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department.name}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block mb-1">Email:*</label>
                <input
                  type="email"
                  name="email"
                  value={newClient.email}
                  onChange={handleInputChange}
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Website:</label>
                <input
                  type="url"
                  name="website"
                  value={newClient.website}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Profile Image:</label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {newClient._id ? "Update Client" : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
