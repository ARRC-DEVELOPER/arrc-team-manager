import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function TicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [category, setCategory] = useState("software");
  const [attachments, setAttachments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("authToken");

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${server}/tickets/getEmployeeTickets`, {
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

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    // formData.append("category", category);
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      const response = await axios.post(
        `${server}/tickets/raiseTicket`,
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
        console.log("Ticket raised successfully:", response.data);
        setIsModalOpen(false);
        toast.success("Task added successfully!");
      } else {
        console.error("Failed to raise ticket");
      }
    } catch (error) {
      console.error("Error raising ticket:", error);
    }
  };

  return (
    <div className="relative p-4">
      {/* Floating Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className=" bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
      >
        + Raise Ticket
      </button>

      {/* Modal for Ticket Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full transition-transform transform duration-300 scale-100">
            <h2 className="text-lg font-bold mb-4">Raise a Ticket</h2>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="mt-2 border p-2 rounded w-full"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="mt-2 border p-2 rounded w-full"
            ></textarea>
            {/* <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 border p-2 rounded w-full"
            >
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
            </select> */}
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
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">My Tickets</h2>
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li
              key={ticket._id}
              className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-medium">{ticket.title}</h3>
                <p className="text-sm text-gray-600">{ticket.description}</p>
                {/* <span
                  className={`text-sm mt-1 inline-block ${
                    ticket.status === "Completed"
                      ? "text-green-500"
                      : ticket.status === "In Progress"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {ticket.status}
                </span> */}
              </div>
              <div>
                <span
                  className={`p-2 text-xs rounded-full ${
                    ticket.status === "Resolved"
                      ? "bg-green-100 text-blue-500"
                      : "bg-purple-100 text-purple-500"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TicketForm;
