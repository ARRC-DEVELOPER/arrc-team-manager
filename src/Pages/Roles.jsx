import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";

import { Dropdown, Menu, Button } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

const permissionsList = [
  "Manage Calendar View",
  "Manage Status",
  "Manage Clients",
  "Manage Projects",
  "Manage Tasks",
  "Manage Entry",
  "Manage Users",
  "Manage Activities",
  "Manage Reports",
  "Manage Roles",
  "Manage Invoices",
  "Manage Settings",
  "Manage Department",
  "Manage Events",
  "Manage Notes",
  "Archived Users",
];

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  const [newRole, setNewRole] = useState({
    name: "",
    permissions: [],
    description: "",
  });
  const [dropdownVisible, setDropdownVisible] = useState(null);

  // Fetch roles from backend
  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${server}/roles`);
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = async () => {
    try {
      const response = await axios.post(`${server}/roles`, newRole);
      setRoles([...roles, response.data]);
      resetForm();
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  const handleEditRole = async () => {
    try {
      await axios.put(`${server}/roles/${editRoleId}`, newRole);
      setRoles(
        roles.map((role) =>
          role._id === editRoleId ? { ...role, ...newRole } : role
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axios.delete(`${server}/roles/${id}`);
        setRoles(roles.filter((role) => role._id !== id));
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditRoleId(null);
    setNewRole({ name: "", permissions: [], description: "" });
  };

  const handlePermissionChange = (permission) => {
    setNewRole((prev) => {
      const permissions = prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Role Management</h1>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Role
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role, index) => (
          <div
            key={role._id}
            className="border rounded shadow-lg mb-5 bg-white p-4 relative"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-primary">{role.name}</h4>
              <div className="relative">
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        onClick={() => handleEditClick(role)}
                        className="hover:bg-gray-200"
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => handleDeleteRole(role._id)}
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
            </div>
            <div className="mt-2">
              <big className="font-weight-bold">
                {role.permissions.length} Permissions
              </big>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded w-full sm:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Role" : "Add Role"}
            </h2>
            <label className="block mb-2">
              Name: *
              <input
                type="text"
                value={newRole.name}
                onChange={(e) =>
                  setNewRole({ ...newRole, name: e.target.value })
                }
                className="border rounded w-full px-2 py-1"
                required
              />
            </label>
            <label className="block mb-2">Permissions:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-2">
              {permissionsList.map((permission) => (
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
                onChange={(e) =>
                  setNewRole({ ...newRole, description: e.target.value })
                }
                className="border rounded w-full px-2 py-1"
              />
            </label>
            <div className="flex justify-end mt-4">
              <button
                onClick={resetForm}
                className="mr-2 bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={isEditing ? handleEditRole : handleAddRole}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {isEditing ? "Update Role" : "Add Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
