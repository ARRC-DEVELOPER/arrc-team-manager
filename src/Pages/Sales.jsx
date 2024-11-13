import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "antd";
import { toast } from "react-toastify";
import { server } from "../main";
import { message } from "antd";
import { FiDownload, FiTrash2 } from "react-icons/fi";
import * as XLSX from "xlsx";

const Sales = () => {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedLead, setSelectedLead] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [isModalVisibleNew, setIsModalVisibleNew] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [excelData, setExcelData] = useState(null);

  const fetchUsers = async () => {
    try {
      const usersResponse = await axios.get(`${server}/users`);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchLeads = async () => {
    try {
      const leadsResponse = await axios.get(`${server}/leads/getAllLeads`);
      setLeads(leadsResponse.data.leads);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  const handleLeadAssignment = async () => {
    if (!selectedLead || !selectedUser) {
      toast.error("Please select both a lead and a user.");
      return;
    }

    try {
      await axios.post(`${server}/leads/assignLeadTask`, {
        leadId: selectedLead,
        userId: selectedUser,
      });

      setSelectedLead("");
      setSelectedUser("");
      setIsModalVisibleNew(false);
      message.success("Lead Task Assigned Successfully");
      fetchLeads();
    } catch (error) {
      console.error("Error assigning lead:", error.message);
      toast.error("Failed to assign lead. Please try again.");
    }
  };

  const handleOpenFile = async (url, originalName) => {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      setSelectedFileName(originalName);
      setExcelData(sheetData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to load Excel file:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisibleNew(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setExcelData(null);
  };

  const filteredUsers = users.filter(
    (user) => user.role === "670546c00e9ed04781616eb6"
  );
  const assignedLeads = leads.filter((lead) => lead.assignedTo !== null);
  const notAssignedLeads = leads.filter((lead) => lead.assignedTo === null);

  return (
    <div>
      <div className="flex justify-between">
        <h2>Sales</h2>
        <Button type="primary" onClick={() => setIsModalVisibleNew(true)}>
          Assign Lead Task
        </Button>
      </div>

      {/* List of Assigned Leads */}
      <div className="mt-6 space-y-4">
        {assignedLeads.length > 0 ? (
          assignedLeads.map((lead) => (
            <div
              key={lead._id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
            >
              <div
                onClick={() => handleOpenFile(lead.fileUrl, lead.originalName)}
                className="flex-1"
              >
                <p className="font-semibold text-gray-800">
                  {lead.originalName}
                </p>
                <p className="text-sm text-gray-500">
                  Uploaded on: {new Date(lead.uploadDate).toLocaleDateString()}
                </p>
              </div>

              {/* Download Button */}
              <a
                href={lead.fileUrl}
                download
                className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-110"
              >
                <FiDownload />
              </a>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteLead(lead._id)}
                className="flex items-center justify-center p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200 ease-in-out transform hover:scale-110 ml-2"
              >
                <FiTrash2 />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No leads uploaded yet.</p>
        )}
      </div>

      {/* Modal for add new task */}
      <Modal
        title="Add Task"
        visible={isModalVisibleNew}
        onCancel={handleCancel}
        footer={null}
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lead Assignment Section */}
          <div>
            <label
              className="block mb-2 font-semibold text-gray-700"
              htmlFor="lead"
            >
              Select Lead
            </label>
            <select
              name="lead"
              value={selectedLead}
              onChange={(e) => setSelectedLead(e.target.value)}
              className="form-select border border-gray-300 rounded-md p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Lead</option>
              {notAssignedLeads.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead.originalName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block mb-2 font-semibold text-gray-700"
              htmlFor="user"
            >
              Assign To User
            </label>
            <select
              name="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="form-select border border-gray-300 rounded-md p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select User</option>
              {filteredUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <Button
              type="button"
              onClick={handleLeadAssignment}
              className="bg-blue-500 text-white w-full mt-4"
            >
              Assign Lead
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal for Excel File Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full md:w-4/5 lg:w-3/5 p-6 overflow-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-teal-600">
                Preview of {selectedFileName}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-900 font-semibold"
              >
                X
              </button>
            </div>
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <tbody>
                {excelData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b hover:bg-gray-50">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="p-2 border border-gray-300 text-sm text-gray-700"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
