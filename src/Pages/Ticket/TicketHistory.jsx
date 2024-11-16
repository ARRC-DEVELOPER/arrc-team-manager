import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { server } from "../../main";

function TicketHistory() {
  const [historyTickets, setHistoryTickets] = useState([]);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const fetchHistoryTickets = async () => {
    try {
      const response = await axios.get(`${server}/tickets/getManagerTickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistoryTickets(response.data);
    } catch (error) {
      console.error("Error fetching history tickets:", error);
    }
  };

  useEffect(() => {
    fetchHistoryTickets();
  }, []);

  // Filter tickets to only show those that are in history
  const activeTickets = historyTickets.filter((ticket) => ticket.history);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg mt-8">
      {/* Modern Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/tickets")}
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
          Back to Tickets
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Ticket History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Created By</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Attachments</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {activeTickets.map((ticket) => (
              <tr
                key={ticket._id}
                className={`border-b border-gray-200 hover:bg-gray-100 transition duration-200 ${
                  ticket.status === "In Progress"
                    ? "bg-yellow-100"
                    : ticket.status === "Resolved"
                    ? "bg-red-100"
                    : "bg-white"
                }`}
              >
                <td className="py-3 px-6 text-left font-medium">
                  {ticket.title}
                </td>
                
                <td className="py-3 px-6 text-left">{ticket.createdBy.name}</td>

                <td className="py-3 px-6 text-center">
                  <span
                    className={`text-xs font-semibold inline-block py-1 px-3 rounded-full text-white ${
                      ticket.status === "Open"
                        ? "bg-blue-500"
                        : ticket.status === "In Progress"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>

                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleShowAttachments(ticket.attachments)}
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

export default TicketHistory;
