import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { server } from "../../main";

function LeaveHistory() {
  const [historyLeaves, setHistoryLeaves] = useState([]);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const fetchHistoryLeaves = async () => {
    try {
      const response = await axios.get(`${server}/leaves/getManagerLeaves`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistoryLeaves(response.data);
    } catch (error) {
      console.error("Error fetching history tickets:", error);
    }
  };

  useEffect(() => {
    fetchHistoryLeaves();
  }, []);

  // Filter tickets to only show those that are in history
  const activeLeaves = historyLeaves.filter((leave) => leave.history);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg mt-8">
      {/* Modern Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/leaves")}
          className="flex items-center text-blue-500 hover:text-blue-600 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Leaves
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Leave History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Employee</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-center">Reason</th>
              <th className="py-3 px-6 text-center">status</th>
              <th className="py-3 px-6 text-center">View Comments</th>
              <th className="py-3 px-6 text-center">Attachments</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {activeLeaves.map((leave) => (
              <tr
                key={leave._id}
                className={`border-b border-gray-200 hover:bg-gray-100 transition duration-200 ${
                  leave.status === "Rejected"
                    ? "bg-yellow-100"
                    : leave.status === "Approved"
                    ? "bg-green-100"
                    : "bg-white"
                }`}
              >
                <td className="py-3 px-6 text-left">{leave.employeeId.name}</td>
                <td className="py-3 px-6 text-left">
                  {new Date(leave.startDate).toLocaleDateString()} -{" "}
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-left">{leave.reason}</td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`text-xs font-semibold inline-block py-1 px-3 rounded-full text-white ${
                      leave.status === "Pending"
                        ? "bg-blue-500"
                        : leave.status === "Rejected"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>

                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => openCommentsModal(leave.comments)}
                    className="bg-gray-500 text-white py-1 px-3 rounded-lg hover:bg-gray-600 transition"
                  >
                    View
                  </button>
                </td>

                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleShowAttachments(leave.attachments)}
                    className="bg-gray-500 text-white py-1 px-3 rounded-lg hover:bg-gray-600 transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaveHistory;
