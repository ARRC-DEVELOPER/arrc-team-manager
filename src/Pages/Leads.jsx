import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUpload, FiDownload, FiTrash2 } from "react-icons/fi";
import * as XLSX from "xlsx";
import { server } from "../main";
import { message } from "antd";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [excelData, setExcelData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${server}/leads/getAllLeads`);
      setLeads(response.data.leads);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${server}/leads/uploadLead`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Lead uploaded successfully");
      fetchLeads();
    } catch (error) {
      console.error("Failed to upload file:", error);
      message.error("Lead upload failed");
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setExcelData(null);
  };

  const handleDeleteLead = async (leadId) => {
    try {
      await axios.delete(`${server}/leads/dltLead/${leadId}`);
      message.success("Lead deleted successfully");
      fetchLeads();
    } catch (error) {
      console.error("Failed to delete lead:", error);
      message.error("Failed to delete lead");
    }
  };

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Leads</h2>

      {/* Upload Button */}
      <label className="flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded cursor-pointer hover:bg-teal-700">
        <FiUpload className="mr-2" />
        Upload Lead File
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {/* List of Uploaded Leads */}
      <div className="mt-6 space-y-4">
        {leads.length > 0 ? (
          leads.map((lead) => (
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

export default Leads;
