import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "antd";
import ReactQuill from "react-quill";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import { server } from "../../main";

const AddTask = ({ setCards }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [isModalVisibleNew, setIsModalVisibleNew] = useState(false);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    projectId: "",
    dueDate: "",
    status: "pending",
    pageSize: 10,
    sortBy: "title",
  });

  const [addTask, setaddTask] = useState({
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await axios.get(
          "https://task-manager-backend-btas.onrender.com/api/projects"
        );
        setProjects(projectsResponse.data);

        const usersResponse = await axios.get(
          "https://task-manager-backend-btas.onrender.com/api/users"
        );
        setUsers(usersResponse.data);

        const [statusesResponse, tasksResponse] = await Promise.all([
          axios.get(
            "https://task-manager-backend-btas.onrender.com/api/statuses"
          ),
          axios.get("https://task-manager-backend-btas.onrender.com/api/tasks"),
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
    if (e.target) {
      const { name, value } = e.target;
      setTaskData((prevData) => ({ ...prevData, [name]: value }));
      setaddTask((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setTaskData((prevData) => ({ ...prevData, description: e }));
      setaddTask((prevData) => ({ ...prevData, description: e }));
    }
  };

  const handleAddTask = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", addTask.title);
    formData.append("projectId", addTask.projectId);
    formData.append("priority", addTask.priority);
    formData.append("assignedTo", addTask.assignedTo);
    formData.append("dueDate", addTask.dueDate);
    formData.append("estimateTime", addTask.estimateTime);
    formData.append("tags", addTask.tags);
    formData.append("description", addTask.description);

    const attachments = document.querySelector(
      'input[name="attachments"]'
    ).files;
    for (let i = 0; i < attachments.length; i++) {
      formData.append("attachments", attachments[i]);
    }

    try {
      const response = await axios.post(`${server}/tasks`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data.savedTask);

      setCards((prev) => [...prev, response.data.savedTask]);

      setIsModalVisibleNew(false);

      toast.success("Task added successfully!");

      console.log("Task added successfully:", response.data);
    } catch (error) {
      console.error("Error adding task:", error);
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
        title="Add Task"
        visible={isModalVisibleNew}
        onCancel={handleCancel}
        footer={null}
      >
        <form
          onSubmit={handleAddTask}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label
              className="block mb-2 font-semibold text-gray-700"
              htmlFor="title"
            >
              Title*
            </label>
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
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
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
              value={addTask.attachments}
              onChange={handleInputChange}
              className="form-input border border-gray-300 rounded-md p-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              multiple
            />
          </div>
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <label
              className="block mb-2 font-semibold text-gray-700"
              htmlFor="description"
            >
              Description
            </label>
            <div className="col-span-2">
              <ReactQuill
                value={addTask.description}
                onChange={handleInputChange}
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
              Add Task
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddTask;
