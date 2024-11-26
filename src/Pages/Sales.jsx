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
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              {/* left */}
              <div
                className="cursor-pointer"
                onClick={() => handleOpenFile(lead.fileUrl, lead.originalName)}
              >
                <p className="font-semibold text-gray-800">
                  {lead.originalName}
                </p>
                <p className="font-semibold text-gray-800">
                  Assinged To: {lead.assignedTo.map((i) => i.name).join(", ")}
                </p>
                <p className="text-sm text-gray-500">
                  Updated on: {new Date(lead.updatedDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-6">
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
              <div className="flex">
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
            </div>
          ))
        ) : (
          <p className="text-gray-500">No leads assigned yet.</p>
        )}
      </div>

      {/* Modal for add new leads */}
      <Modal
        title="Add Task"
        visible={isModalVisibleNew}
        onCancel={handleCancel}
        footer={null}
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Select Lead
            </label>
            <select
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
            <label className="block mb-2 font-semibold text-gray-700">
              Assign To Users*
            </label>
            <select
              name="assignedTo"
              value={selectedUsers}
              onChange={(e) => {
                const options = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setSelectedUsers(options);
              }}
              className="form-select border border-gray-300 rounded-md p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              multiple
            >
              {filteredUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

            {/* Display selected users */}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-600">Selected Users:</h4>
              <ul>
                {selectedUsers.length > 0 ? (
                  selectedUsers.map((userId) => {
                    const user = filteredUsers.find(
                      (user) => user._id === userId
                    );
                    return <li key={userId}>{user?.name}</li>;
                  })
                ) : (
                  <li>No users selected</li>
                )}
              </ul>
            </div>
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

      {/* Follow-Up Leads Modal */}
      <Modal
        title="Follow-Up Leads"
        visible={isFollowUpModalOpen}
        onCancel={handleCloseFollowUpModal}
        footer={null}
      >
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="p-2 border border-gray-300">Client Name</th>
              <th className="p-2 border border-gray-300">Mobile Number</th>
              <th className="p-2 border border-gray-300">City</th>
              <th className="p-2 border border-gray-300">Follow-Up Date</th>
              <th className="p-2 border border-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {followUpLeads.length > 0 ? (
              followUpLeads.map((followUp, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border border-gray-300">
                    {followUp["Calinet Name"]}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {followUp["Mobile Number"]}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {followUp.City}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {followUp["Follow-up Date"]}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {followUp.Status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-4 border border-gray-300"
                >
                  No follow-up leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Modal>
    </div>
  );
};

export default Sales;
