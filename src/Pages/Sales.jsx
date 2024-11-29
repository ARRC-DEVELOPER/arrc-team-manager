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
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedLead, setSelectedLead] = useState("");
  const [selectedUsers, setSelectedUsers] = useState("");
  const [isModalVisibleNew, setIsModalVisibleNew] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [excelData, setExcelData] = useState(null);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [followUpLeads, setFollowUpLeads] = useState([]);

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
    if (!selectedLead || selectedUsers.length === 0) {
      toast.error("Please select both a lead and a user.");
      return;
    }

    try {
      await axios.post(`${server}/leads/assignLeadTask`, {
        leadId: selectedLead,
        assignedTo: selectedUsers,
      });

      setSelectedLead("");
      setSelectedUsers("");
      setIsModalVisibleNew(false);
      message.success("Lead Task Assigned Successfully");
      fetchLeads();
    } catch (error) {
      console.error("Error assigning lead:", error.message);
      toast.error("Failed to assign lead. Please try again.");
    }
  };

  const openModalForUpdate = (lead) => {
    setSelectedLead(lead._id);
    setSelectedUsers(lead.assignedTo.map((user) => user._id));
    setIsUpdateMode(true);
    setIsModalVisibleNew(true);
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
    setSelectedLead("");
    setSelectedUsers([]);
    setIsModalVisibleNew(false);
    setIsUpdateMode(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setExcelData(null);
  };

  const handleOpenFollowUpModal = (leadFollowUpLeads) => {
    setFollowUpLeads(leadFollowUpLeads);
    setIsFollowUpModalOpen(true);
  };

  const handleCloseFollowUpModal = () => {
    setFollowUpLeads([]);
    setIsFollowUpModalOpen(false);
  };

  const filteredUsers = users.filter(
    (user) => user.role === "670546c00e9ed04781616eb6"
  );

  const assignedLeads = leads.filter((lead) => lead.assignedTo.length !== 0);
  const notAssignedLeads = leads.filter((lead) => lead.assignedTo.length === 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold">Sales</h2>
        <Button
          type="primary"
          onClick={() => setIsModalVisibleNew(true)}
          className="mt-4 sm:mt-0"
        >
          Assign Lead Task
        </Button>
      </div>

      {/* List of Assigned Leads */}
      <div className="mt-6 space-y-4">
        {assignedLeads.length > 0 ? (
          assignedLeads.map((lead) => (
            <div
              key={lead._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              {/* left */}
              <div
                className="cursor-pointer mb-4 sm:mb-0"
                onClick={() => handleOpenFile(lead.fileUrl, lead.originalName)}
              >
                <p className="font-semibold text-gray-800">{lead.originalName}</p>
                <p className="font-semibold text-gray-800">
                  Assigned To: {lead.assignedTo.map((i) => i.name).join(", ")}
                </p>
                <p className="text-sm text-gray-500">
                  Updated on: {new Date(lead.updatedDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-4">
                <div className="text-center">
                  <Button
                    onClick={() => openModalForUpdate(lead)}
                    type="default"
                    className="bg-yellow-400 text-black hover:bg-yellow-500"
                  >
                    Update Assigned To
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xl text-gray-500">Updated</p>
                  <span className="text-lg font-semibold text-green-600">
                    {lead.updatedRecords || 0}
                  </span>
                </div>

                <div className="text-center">
                  <p className="text-xl text-gray-500">Remaining</p>
                  <span className="text-lg font-semibold text-red-600">
                    {lead.notUpdatedRecords || 0}
                  </span>
                </div>

                <div
                  className="text-center cursor-pointer"
                  onClick={() => handleOpenFollowUpModal(lead.followupLeads)}
                >
                  <p className="text-xl text-gray-500">Follow Up Due</p>
                  <span className="text-lg font-semibold text-red-600">
                    {lead.followUpCount || 0}
                  </span>
                </div>
              </div>

              {/* right */}
              <div className="flex gap-2">
                <a
                  href={lead.fileUrl}
                  download
                  className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-110"
                >
                  <FiDownload />
                </a>

                <button
                  onClick={() => handleDeleteLead(lead._id)}
                  className="flex items-center justify-center p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200 ease-in-out transform hover:scale-110"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No leads assigned yet.</p>
        )}
      </div>

      {/* Modal for Add/Update Leads */}
      <Modal
        title={isUpdateMode ? "Update Task" : "Assign Lead Task"}
        visible={isModalVisibleNew}
        onCancel={handleCancel}
        footer={null}
        width="90%"
        className="max-w-lg"
      >
        <form>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700">
              Select a Lead
            </label>
            <select
              value={selectedLead}
              onChange={(e) => setSelectedLead(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            >
              <option value="">Select a Lead</option>
              {notAssignedLeads.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead.originalName}
                </option>
              ))}
            </select>
          </div>

          {/* Select Users */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Select Users</label>
            <select
              value={selectedUsers}
              onChange={(e) => setSelectedUsers(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
              multiple
            >
              {filteredUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between mt-4">
            <Button onClick={handleCancel} className="w-full sm:w-auto" type="default">
              Cancel
            </Button>
            <Button
              type="primary"
              className="w-full sm:w-auto"
              onClick={handleLeadAssignment}
            >
              {isUpdateMode ? "Update" : "Assign"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Excel File Modal */}
      <Modal
        title="Excel Data"
        visible={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width="90%"
        className="max-w-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="p-2 border-b">#</th>
                <th className="p-2 border-b">Name</th>
                <th className="p-2 border-b">Age</th>
                <th className="p-2 border-b">City</th>
              </tr>
            </thead>
            <tbody>
              {excelData &&
                excelData.map((row, index) => (
                  <tr key={index}>
                    <td className="p-2 border-b">{index + 1}</td>
                    <td className="p-2 border-b">{row[0]}</td>
                    <td className="p-2 border-b">{row[1]}</td>
                    <td className="p-2 border-b">{row[2]}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};

export default Sales;
