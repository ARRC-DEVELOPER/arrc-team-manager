import React, { useEffect, useState } from 'react';
import axios from 'axios';

const permissionsList = [
  "Manage Calendar View",
  "Manage Status",
  "Manage Clients",
  "Manage Projects",
  "Manage Tasks",
  "Manage Entry",
  "Manage Users",
  "Manage Tags",
  "Manage Activities",
  "Manage Reports",
  "Manage Roles",
  "Manage Taxes",
  "Manage Invoices",
  "Manage Settings",
  "Manage Department",
  "Manage Expenses",
  "Manage Activity Log",
  "Manage Events",
  "Archived Users",
];

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  const [newRole, setNewRole] = useState({ name: '', permissions: [], description: '' });
  const [dropdownVisible, setDropdownVisible] = useState(null);

  // Fetch roles from backend
  const fetchRoles = async () => {
    try {
      const response = await axios.get('https://task-manager-backend-btas.onrender.com/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = async () => {
    try {
      const response = await axios.post('https://task-manager-backend-btas.onrender.com/api/roles', newRole);
      setRoles([...roles, response.data]);
      resetForm();
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  const handleEditRole = async () => {
    try {
      await axios.put(`https://task-manager-backend-btas.onrender.com/api/roles/${editRoleId}`, newRole);
      setRoles(roles.map(role => (role._id === editRoleId ? { ...role, ...newRole } : role)));
      resetForm();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await axios.delete(`https://task-manager-backend-btas.onrender.com/api/roles/${id}`);
        setRoles(roles.filter(role => role._id !== id));
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditRoleId(null);
    setNewRole({ name: '', permissions: [], description: '' });
  };

  const handlePermissionChange = (permission) => {
    setNewRole(prev => {
      const permissions = prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions };
    });
  };

  const handleEllipsisClick = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  const handleEditClick = (role) => {
    setNewRole(role);
    setIsEditing(true);
    setEditRoleId(role._id);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* <button 
        onClick={() => {
          resetForm();
          setShowModal(true);
        }} 
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
        Add Role
      </button>
 */}
<div className="flex justify-between items-center mb-4">
<h1 className="text-2xl font-bold mb-4">Role Management</h1>

  <button 
    onClick={() => {
      resetForm();
      setShowModal(true);
    }} 
    className="bg-blue-500 text-white px-4 py-2 rounded">
    Add Role
  </button>
</div>
{/* <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button onClick={() => showModal()} className="px-4 py-2 bg-blue-600 text-white rounded">
          New Projects +
        </button>
      </div>
 */}

      <div className="grid grid-cols-4 gap-4">
        {roles.map((role, index) => (
          <div key={role._id} className="border rounded shadow-lg mb-5 bg-white p-4 relative">
            <div className="flex justify-between items-center">
              <h4 className="text-primary">{role.name}</h4>
              <div className="relative">
                <button onClick={() => handleEllipsisClick(index)} className="focus:outline-none">
                  &#x22EE; {/* Ellipsis icon */}
                </button>

                {dropdownVisible === index && (
                  <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded shadow-lg">
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleEditClick(role)}
                    >
                      Edit
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleDeleteRole(role._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <big className="font-weight-bold">{role.permissions.length} Permissions</big>
            </div>
          </div>
        ))}
      </div>

{showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded w-[65%] shadow-lg">
      <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Role' : 'Add Role'}</h2>
      <label className="block mb-2">
        Name: *
        <input 
          type="text" 
          value={newRole.name} 
          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })} 
          className="border rounded w-full px-2 py-1"
          required
        />
      </label>
      <label className="block mb-2">Permissions:</label>
      <div className="grid grid-cols-4 gap-4 mb-2"> {/* Changed to 4 columns */}
        {permissionsList.map(permission => (
          <label key={permission} className="flex items-center">
            <input 
              type="checkbox" 
              checked={newRole.permissions.includes(permission)}
              onChange={() => handlePermissionChange(permission)} 
              className="mr-2"
            />
            {permission}
          </label>
        ))}
      </div>
      <label className="block mb-2">
        Description:
        <textarea 
          value={newRole.description} 
          onChange={(e) => setNewRole({ ...newRole, description: e.target.value })} 
          className="border rounded w-full px-2 py-1"
        />
      </label>
      <div className="flex justify-end mt-4">
        <button onClick={resetForm} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
        <button 
          onClick={isEditing ? handleEditRole : handleAddRole} 
          className="bg-blue-500 text-white px-4 py-2 rounded">
          {isEditing ? 'Update Role' : 'Add Role'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Roles;
