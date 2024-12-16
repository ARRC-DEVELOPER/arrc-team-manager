import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { server } from "../../main";
import { message, Pagination } from "antd";

function LeaveForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const handlePaginationChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`${server}/leaves/getEmployeeLeaves`, {
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
    fetchLeaves();

    const interval = setInterval(fetchLeaves, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter leaves to only show those that are not yet in history
  const activeLeaves = leaves.filter((leave) => !leave.history);

  const paginatedLeaves = activeLeaves.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("reason", reason);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      const response = await axios.post(
        `${server}/leaves/applyLeave`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },
        }
      );

      if (response.status === 201) {
        console.log("Leave applied successfully:", response.data);
        setIsModalOpen(false);
        fetchLeaves();
        message.success("Leave applied successfully!");
      } else {
        console.error("Failed to apply leave");
        message.error("Failed to apply leave");
      }
    } catch (error) {
      console.error("Error applying leave:", error);
    }
  };

  const openCommentsModal = (comments) => {
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

  const updateLeave = async (id, feedback = null) => {
    try {
      const response = await axios.put(
        `${server}/leaves/emergencyLeave/${id}`,
        { feedback },
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

      fetchLeaves();
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const emergencyHandler = (id) => {
    updateLeave(id, "Emergency Leave");
  };
  const thankyouHandler = (id) => {
    updateLeave(id, "Thank You");
  };

  return (
    <div className="relative p-4">
      {/* Floating Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className=" bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
      >
        + Apply Leave
      </button>

      {/* Modal for leave Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full transition-transform transform duration-300 scale-100">
            <h2 className="text-lg font-bold mb-4">Apply Leave</h2>
            <input
              type="date"
              value={startDate}
              placeholder="Start Date"
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <input
              type="date"
              value={endDate}
              placeholder="End Date"
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason"
              className="mt-2 border p-2 rounded w-full"
            ></textarea>
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              className="mt-2"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Submit leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* leave List */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Applied Leaves
          </h2>
          <div className="space-x-2">
            <button
              onClick={handleHistoryClick}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
            >
              History
            </button>
          </div>
        </div>

        <ul className="space-y-4">
          {paginatedLeaves.map((leave) => (
            <li
              key={leave._id}
              className={`p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-between ${leave.feedback === "Emergency Leave"
                ? "bg-red-100"
                : leave.feedback === "Thank You"
                  ? "bg-green-100"
                  : "bg-white"
                }`}
            >
              <div>
                <h3 className="text-lg font-medium">{leave.reason}</h3>
                <p className="text-sm text-gray-600">{leave.startDate}</p>
                <p className="text-sm text-gray-600">{leave.endDate}</p>
              </div>

              <div className="flex border-red items-center">
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => openCommentsModal(leave.comments)}
                    className="bg-gray-500 text-white py-1 px-3 rounded-lg hover:bg-gray-600 transition"
                  >
                    View Comments
                  </button>
                </td>

                {leave.status === "Rejected" && (
                  <div className="relative">
                    <button
                      onClick={() => emergencyHandler(leave._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition"
                    >
                      Leave Emergency
                    </button>
                  </div>
                )}

                {leave.status === "Approved" && (
                  <button
                    onClick={() => thankyouHandler(leave._id)}
                    className="bg-green-500 text-white py-1 px-9 rounded-lg hover:bg-green-600 transition"
                  >
                    Thank You
                  </button>
                )}
              </div>

              <div>
                <span
                  className={`text-xs font-semibold inline-block py-1 px-3 rounded-full text-white ${leave.status === "Pending"
                    ? "bg-blue-500"
                    : leave.status === "Rejected"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                    }`}
                >
                  {leave.status}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={activeLeaves.length}
          onChange={handlePaginationChange}
          showSizeChanger
          pageSizeOptions={['6', '12', '24']}
          className="w-[20%] mt-4 m-auto"
        />

        {/* Comments Modal */}
        {showCommentsModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Comments</h3>
              {modalContent.length > 0 ? (
                <div className="space-y-4">
                  {modalContent.map((comment, index) => (
                    <p key={index}>
                      {comment.createdBy.name}: {comment.message}
                    </p>
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
    </div>
  );
}

export default LeaveForm;
