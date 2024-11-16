import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../main";
import { useNavigate } from "react-router-dom";

function TicketList() {
  const [comments, setComments] = useState({});
  const [tickets, setTickets] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

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

    // Set up a periodic refresh every 10 minutes
    const interval = setInterval(fetchTickets, 10 * 60 * 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
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

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === id ? { ...ticket, ...response.data.ticket } : ticket
        )
      );
      setComments({ ...comments, [id]: "" });
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const handleAddComment = (id) => {
    updateTicket(id, null, comments[id]);
  };

  const handleStatusUpdate = (id, status) => {
    updateTicket(id, status, comments[id] || null);
  };

  const handleHistoryClick = () => {
    navigate("/ticket-history");
  };

  const handleShowAttachments = (attachments) => {
    setAttachments(attachments);
    setShowModal(true);
  };

  const closeAttachmentsModal = () => {
    setShowModal(false);
    setAttachments([]);
  };

  const openFullScreenImage = (image) => {
    setFullScreenImage(image);
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  // Filter tickets to only show those that are not yet in history
  const activeTickets = tickets.filter((ticket) => !ticket.history);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Ticket List</h2>
        <div className="space-x-2">
          <button
            onClick={handleHistoryClick}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
          >
            History
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Created By</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
              <th className="py-3 px-6 text-center">Comment</th>
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Attachments</h3>
            {attachments.length > 0 ? (
              <div className="space-y-4">
                {attachments.map((attachment, index) => (
                  <img
                    key={index}
                    src={attachment}
                    alt={`Attachment ${index + 1}`}
                    className="w-full h-auto rounded-lg border cursor-pointer"
                    onClick={() => openFullScreenImage(attachment)}
                  />
                ))}
              </div>
            ) : (
              <p>No attachments found</p>
            )}
            <button
              onClick={closeAttachmentsModal}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {fullScreenImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
          onClick={closeFullScreenImage}
        >
          <img
            src={fullScreenImage}
            alt="Full Screen"
            className="max-w-full max-h-full rounded-lg -z-50"
          />
        </div>
      )}
    </div>
  );
}

export default TicketList;
