import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "antd";
import ReactQuill from "react-quill";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import { server } from "../../main";
import { FaMicrophone } from "react-icons/fa";

const AddTask = ({ setCards, editingTask, setEditingTask }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [isModalVisibleNew, setIsModalVisibleNew] = useState(false);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assignedTo: [],
    projectId: "",
    dueDate: "",
    status: "pending",
    pageSize: 10,
    sortBy: "title",
    attachments: [],
  });

  const [addTask, setaddTask] = useState(
    editingTask || {
      title: "",
      description: "",
      assignedTo: [],
      projectId: "",
      dueDate: "",
      status: "pending",
      priority: "low",
      estimateTime: "",
      tags: "",
      attachments: [],
    }
  );

  const [isListening, setIsListening] = useState(false);
  const [isListeningDescription, setIsListeningDescription] = useState(false);

  // Speech Recognition setup
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (editingTask) {
      setaddTask({
        ...editingTask,
        dueDate: editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split("T")[0]
          : "",
        tags: editingTask.tags ? editingTask.tags.join(", ") : "",
      });
      setIsModalVisibleNew(true);
    }
  }, [editingTask]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await axios.get(`${server}/projects`);
        setProjects(projectsResponse.data);

        const usersResponse = await axios.get(`${server}/users`);
        setUsers(usersResponse.data);

        const token = localStorage.getItem("authToken");
        const [statusesResponse, tasksResponse] = await Promise.all([
          axios.get(`${server}/statuses`),
          axios.get(`${server}/getTasks`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
        ]);

        const statuses = statusesResponse.data;
        const tasks = tasksResponse.data;

        const formattedStatuses = statuses.reduce((acc, status) => {
          acc[status._id] = { title: status.name };
          return acc;
        }, {});

        // Map tasks to include statusId
        const tasksWithStatusId = tasks.map((task) => {
          const defaultStatusId = Object.keys(formattedStatuses)[0];
          return { ...task, statusId: task.statusId || defaultStatusId };
        });
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, []);

  const showModalNew = () => {
    setIsModalVisibleNew(true);
  };

  const handleCancel = () => {
    setIsModalVisibleNew(false);
    handleReset();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "assignedTo") {
      const selectedUserId = value;
      console.log(selectedUserId);
      setTaskData((prevData) => {
        const assignedTo = prevData.assignedTo.includes(selectedUserId)
          ? prevData.assignedTo.filter((id) => id !== selectedUserId)
          : [...prevData.assignedTo, selectedUserId];
        return { ...prevData, assignedTo };
      });

      setaddTask((prevData) => {
        const assignedTo = prevData.assignedTo.includes(selectedUserId)
          ? prevData.assignedTo.filter((id) => id !== selectedUserId)
          : [...prevData.assignedTo, selectedUserId];
        return { ...prevData, assignedTo };
      });
    } else if (name === "attachments") {
      const selectedFiles = Array.from(e.target.files);
      setTaskData((prevData) => ({
        ...prevData,
        attachments: [...prevData.attachments, ...selectedFiles],
      }));
      setaddTask((prevData) => ({
        ...prevData,
        attachments: [...prevData.attachments, ...selectedFiles],
      }));
    } else if (name === "dueDate") {
      console.log(value);
      setTaskData((prevData) => ({ ...prevData, dueDate: value }));
      setaddTask((prevData) => ({ ...prevData, dueDate: value }));

      const currentTime = new Date();
      const selectedDueDate = new Date(value);
      const timeDifference = selectedDueDate - currentTime;

      if (timeDifference > 0) {
        const seconds = Math.floor((timeDifference / 1000) % 60);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        let estimateTime = "";
        if (days > 0) estimateTime += `${days} day${days > 1 ? "s" : ""} `;
        if (hours > 0) estimateTime += `${hours} hour${hours > 1 ? "s" : ""}`;

        setTaskData((prevData) => ({ ...prevData, estimateTime }));
        setaddTask((prevData) => ({ ...prevData, estimateTime }));
      } else {
        setTaskData((prevData) => ({ ...prevData, estimateTime: "" }));
        setaddTask((prevData) => ({ ...prevData, estimateTime: "" }));
      }
    } else if (e.target) {
      setTaskData((prevData) => ({ ...prevData, [name]: value }));
      setaddTask((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setTaskData((prevData) => ({ ...prevData, description: e }));
      setaddTask((prevData) => ({ ...prevData, description: e }));
    }
  };

  const handleMicClick = () => {
    if (!recognition) {
      toast.error("Speech Recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setaddTask((prevData) => ({ ...prevData, title: transcript }));
        setTaskData((prevData) => ({ ...prevData, title: transcript }));
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        toast.error(`Error occurred during recognition: ${event.error}`);
        setIsListening(false);
      };
    }
  };

  const handleDescriptionMicClick = () => {
    if (!recognition) {
      toast.error("Speech Recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListeningDescription(false);
    } else {
      recognition.start();
      setIsListeningDescription(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setaddTask((prevData) => ({ ...prevData, description: transcript }));
        setTaskData((prevData) => ({ ...prevData, description: transcript }));
        setIsListeningDescription(false);
      };

      recognition.onerror = (event) => {
        toast.error(`Error occurred during recognition: ${event.error}`);
        setIsListeningDescription(false);
      };
    }
  };

  const handleAddTask = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", addTask.title);
    formData.append("projectId", addTask.projectId);
    formData.append("priority", addTask.priority);
    addTask.assignedTo.forEach((userId) =>
      formData.append("assignedTo", userId)
    );
    formData.append("dueDate", addTask.dueDate);
    formData.append("estimateTime", addTask.estimateTime);
    formData.append("tags", addTask.tags);
    formData.append("description", addTask.description);

    addTask.attachments.forEach((file) => formData.append("attachments", file));

    if (editingTask) {
      // EDDITING TASK
      try {
        const response = await axios.put(
          `${server}/tasks/${editingTask._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Re-fetch tasks after updating
        const token = localStorage.getItem("authToken");
        const updatedTasks = await axios.get(`${server}/getTasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
        setCards(updatedTasks.data);

        setIsModalVisibleNew(false);
        setEditingTask(null);

        toast.success("Task updated successfully!");

        console.log("Task updated successfully:", response.data);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      // ADDING NEW TASK
      try {
        const response = await axios.post(`${server}/tasks`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(response.data.savedTask);

        // Re-fetch tasks after updating
        const token = localStorage.getItem("authToken");
        const updatedTasks = await axios.get(`${server}/getTasks`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setCards(updatedTasks.data);

        setIsModalVisibleNew(false);

        toast.success("Task added successfully!");

        console.log("Task added successfully:", response.data);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleReset = () => {
    setTaskData({
      title: "",
      description: "",
      assignedTo: "",
      projectId: "",
      dueDate: "",
      status: "pending",
      pageSize: 10,
      sortBy: "title",
    });

    setaddTask({
      title: "",
      description: "",
      assignedTo: "",
      projectId: "",
      dueDate: "",
      status: "pending",
      priority: "low",
      estimateTime: "",
      tags: "",
    });
  };
  return (
    <>
      <div className="flex bg-gray-100 p-8 justify-between items-center mb-4 m-auto w-[90%]">
        <h1 className="text-2xl font-bold">TASKS</h1>
        <nav className="flex gap-2 items-center">
          <Button
            onClick={showModalNew}
            className="bg-green-400 text-white hover:bg-yellow-500 transition"
            title="Assign Task"
          >
            New Task
          </Button>
        </nav>
      </div>

      <Modal
        title={editingTask ? "Edit Task" : "Add Task"}
        visible={isModalVisibleNew}
        onCancel={handleCancel}
        footer={null}
      >
        <form
          onSubmit={handleAddTask}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <div className="flex gap-5">
              <label
                className="block mb-2 font-semibold text-gray-700"
                htmlFor="title"
              >
                Title*
              </label>
              <FaMicrophone
                className={`cursor-pointer text-lg ${isListening ? "text-red-500" : "text-gray-500"
                  }`}
                onClick={handleMicClick}
                title="Voice Input"
              />
            </div>

            <input
              type="text"
              name="title"
              value={addTask.title}
              onChange={handleInputChange}
              className="form-input border border-gray-300 rounded-md p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              className="block mb-2 font-semibold text-gray-700"
              htmlFor="projectId"
            >
              Project*
            </label>
            <select
              name="projectId"
              value={addTask.projectId}
              onChange={handleInputChange}
              className="form-select border border-gray-300 rounded-md p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="block mb-2 font-semibold text-gray-700"
              htmlFor="priority"
            >
              Priority*
            </label>
            <select
              name="priority"
              value={addTask.priority}
              onChange={handleInputChange}
              className="form-select border border-gray-300 rounded-md p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label
              className="block mb-2 font-semibold text-gray-700"
              htmlFor="assignedTo"
            >
              Assigned To*
            </label>
            <select
              name="assignedTo"
              value={addTask.assignedTo}
              onChange={handleInputChange}
              className="form-select border border-gray-300 rounded-md p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              multiple
              required
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

            {/* Display selected users */}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-600">Selected Users:</h4>
              <ul>
                {addTask.assignedTo.length > 0 ? (
                  addTask.assignedTo.map((userId) => {
                    const user = users.find((user) => user._id === userId);
                    return <li key={userId}>{user?.name}</li>;
                  })
                ) : (
                  <li>No users selected</li>
                )}
              </ul>
            </div>
          </div>

          <div>
            <label
              className="block mb-2 font-semibold text-gray-700"
              htmlFor="dueDate"
            >
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={addTask.dueDate}
              onChange={handleInputChange}
              className="form-input border border-gray-300 rounded-md p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              className="block mb-2 font-semibold text-gray-700"
              htmlFor="estimateTime"
            >
              Estimate Time (e.g., "2 days 3 hours")
            </label>
            <input
              type="text"
              name="estimateTime"
              value={addTask.estimateTime}
              onChange={handleInputChange}
              placeholder="e.g., 2 days 3 hours"
              className="form-input border border-gray-300 rounded-md p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              className="block mb-2 font-semibold text-gray-700"
              htmlFor="tags"
            >
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={addTask.tags}
              onChange={handleInputChange}
              placeholder="e.g., urgent, important"
              className="form-input border border-gray-300 rounded-md p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              className="block mb-2 font-semibold text-gray-700"
              htmlFor="attachments"
            >
              Attachments
            </label>
            <input
              type="file"
              name="attachments"
              multiple
              onChange={handleInputChange}
              className="form-input border border-gray-300 rounded-md p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Display selected attachments */}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-600">
                Selected Attachments:
              </h4>
              <ul>
                {addTask.attachments?.length > 0 ? (
                  addTask.attachments.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))
                ) : (
                  <li>No attachments selected</li>
                )}
              </ul>
            </div>
          </div>

          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <div className="flex gap-5">
              <label
                className="block mb-2 font-semibold text-gray-700"
                htmlFor="description"
              >
                Description
              </label>
              <FaMicrophone
                className={`cursor-pointer text-lg ${isListeningDescription ? "text-red-500" : "text-gray-500"
                  }`}
                onClick={handleDescriptionMicClick}
                title="Voice Input"
              />
            </div>
            <div className="col-span-2">
              <ReactQuill
                name={"description"}
                value={addTask.description}
                onChange={(value) =>
                  handleInputChange({ target: { name: "description", value } })
                }
                className="border border-gray-300 rounded-md shadow-sm"
                theme="snow"
              />
            </div>
          </div>
          <div className="col-span-2 flex justify-between">
            <Button
              type="default"
              onClick={handleCancel}
              className="ml-4 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              {editingTask ? "Edit Task" : "Add Task"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddTask;
