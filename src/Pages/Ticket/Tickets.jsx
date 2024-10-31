import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../main";

function TicketList() {
  const [comments, setComments] = useState({});
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("authToken");

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${server}/tickets/getManagerTickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCommentChange = (e, id) => {
    setComments({ ...comments, [id]: e.target.value });
  };

  const updateTicket = async (id, status = null, comment = null) => {
    try {
      const response = await axios.put(
        `${server}/tickets/reviewTicket/${id}`,
        { status, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the specific ticket in the state directly
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === id ? { ...ticket, ...response.data.ticket } : ticket
        )
      );
      setComments({ ...comments, [id]: "" }); // Clear comment input for this ticket
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const handleAddComment = (id) => {
    updateTicket(id, null, comments[id]);
  };

  const handleStatusUpdate = (id, status) => {
    updateTicket(id, status, comments[id] || null); // Optional: send comment if it exists
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ticket List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
              <th className="py-3 px-6 text-center">Comment</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {tickets.map((ticket) => (
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
                <td className="py-3 px-6 text-left">{ticket.category}</td>
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
                    onClick={() =>
                      handleStatusUpdate(ticket._id, "In Progress")
                    }
                    className="bg-yellow-400 text-white py-1 px-3 rounded-lg hover:bg-yellow-500 mr-2 transition"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(ticket._id, "Resolved")}
                    className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition"
                  >
                    Resolved
                  </button>
                </td>
                <td className="py-3 px-6 text-center">
                  <input
                    type="text"
                    value={comments[ticket._id] || ""}
                    onChange={(e) => handleCommentChange(e, ticket._id)}
                    placeholder="Add comment"
                    className="border rounded-lg px-3 py-1 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    onClick={() => handleAddComment(ticket._id)}
                    className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition"
                  >
                    Submit
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

export default TicketList;
