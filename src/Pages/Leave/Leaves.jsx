// ADMIN

import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";
import { useNavigate } from "react-router-dom";

function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [comments, setComments] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get(`${server}/leaves/getManagerLeaves`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();

    const interval = setInterval(fetchLeaveRequests, 10 * 60 * 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleCommentChange = (e, id) => {
    setComments({ ...comments, [id]: e.target.value });
  };

  const updateLeave = async (id, status = null, comment = null) => {
    try {
      const response = await axios.put(
        `${server}/leaves/reviewLeaves/${id}`,
        { status, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave._id === id ? { ...leave, ...response.data.leave } : leave
        )
      );

      setComments({ ...comments, [id]: "" });
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const handleAddComment = (id) => {
    updateLeave(id, null, comments[id]);
  };

  const handleStatusUpdate = (id, status) => {
    updateLeave(id, status, comments[id] || null);
  };

  const handleShowAttachments = (attachments) => {
    setAttachments(attachments);
    setShowModal(true);
  };

  const closeAttachmentsModal = () => {
    setShowModal(false);
    setAttachments([]);
  };

  const openCommentsModal = (comments) => {
    console.log(comments);
    setModalContent(comments);
    setShowCommentsModal(true);
  };

  const closeCommentsModal = () => {
    setShowCommentsModal(false);
    setModalContent([]);
  };

  const handleHistoryClick = () => {
    navigate("/leave-history");
  };

  // Filter leaves to only show those that are not yet in history
  const activeLeaves = leaves.filter((leave) => !leave.history);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg max-w-sm sm:max-w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Leave Requests</h2>
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
              <th className="py-3 px-6 text-left">Employee</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-center">Reason</th>
              <th className="py-3 px-6 text-center">status</th>
              <th className="py-3 px-6 text-center">Comment</th>
              <th className="py-3 px-6 text-center">View Comments</th>
              <th className="py-3 px-6 text-center">Attachments</th>
              <th className="py-3 px-6 text-center">Actions</th>
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
                <td className="py-3 px-6 text-left">{leave?.employeeId?.name}</td>
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
                  <input
                    type="text"
                    value={comments[leave._id] || ""}
                    onChange={(e) => handleCommentChange(e, leave._id)}
                    placeholder="Add comment"
                    className="border rounded-lg px-3 py-1 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    onClick={() => handleAddComment(leave._id)}
                    className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition"
                  >
                    Submit
                  </button>
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

                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleStatusUpdate(leave._id, "Approved")}
                    className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(leave._id, "Rejected")}
                    className="bg-yellow-400 text-white py-1 px-3 rounded-lg hover:bg-yellow-500 mr-2 transition"
                  >
                    Reject
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

      {/* Comments Modal */}
      {showCommentsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            {modalContent.length > 0 ? (
              <div className="space-y-4">
                {modalContent.map((comment, index) => (
                  <p key={index}>{comment.createdBy.name}: {comment.message}</p>
                ))}
              </div>
            ) : (
              <p>No comments found</p>
            )}
            <button
              onClick={closeCommentsModal}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaves;
