import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Modal, Button } from 'antd';
import ReactQuill from 'react-quill';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify'; 

const Tasks = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const [statuses, setStatuses] = useState({});
  const [error, setError] = useState('');
  const [viewType, setViewType] = useState('grid');
  const [isModalVisible, setIsModalVisible] = useState(false); // State for task assignment modal
  const [isModalVisibleNew, setIsModalVisibleNew] = useState(false); // State for new task modal
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    projectId: '',
    dueDate: '',
    status: 'pending',
    pageSize: 10,
    sortBy: 'title'
  });
  const [addTask, setAddTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    projectId: '',
    dueDate: '',
    status: 'pending',
    priority: 'low',
    estimateTime: '',
    tags: '',
  });
  
  console.log(tasks)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await axios.get("https://task-manager-backend-btas.onrender.com/api/projects");
        setProjects(projectsResponse.data);
  
        const usersResponse = await axios.get('https://task-manager-backend-btas.onrender.com/api/users');
        setUsers(usersResponse.data);
  
        const [statusesResponse, tasksResponse] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/statuses'),
          axios.get('https://task-manager-backend-btas.onrender.com/api/tasks'),
        ]);
  
        const statuses = statusesResponse.data;
        const tasks = tasksResponse.data;
  
        const formattedStatuses = statuses.reduce((acc, status) => {
          acc[status._id] = { title: status.name };
          return acc;
        }, {});
  
        const tasksWithStatusId = tasks.map(task => {
          const defaultStatusId = Object.keys(formattedStatuses)[0]; 
          return { ...task, statusId: task.statusId || defaultStatusId }; 
        });
  
        setTasks(tasksWithStatusId);
        setStatuses(formattedStatuses);
      } catch (error) {
        setError("Failed to fetch data. Please try again.");
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
      }
    };
  
    fetchData();
  }, []);
  
  const handleToggleView = () => {
    setViewType((prevType) => (prevType === 'grid' ? 'list' : 'grid'));
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showModalNew = () => {
    setIsModalVisibleNew(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsModalVisibleNew(false);
    handleReset(); // Reset task data on cancel
  };

  const handleInputChange = (e) => {
    if (e.target) {
      const { name, value } = e.target;
      setTaskData((prevData) => ({ ...prevData, [name]: value }));
      setAddTask((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setTaskData((prevData) => ({ ...prevData, description: e }));
      setAddTask((prevData) => ({ ...prevData, description: e }));
    }
  };
  
  const handleAddTask = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('title', addTask.title);
    formData.append('projectId', addTask.projectId);
    formData.append('priority', addTask.priority);
    formData.append('assignedTo', addTask.assignedTo);
    formData.append('dueDate', addTask.dueDate);
    formData.append('estimateTime', addTask.estimateTime);
    formData.append('tags', addTask.tags); 
    formData.append('description', addTask.description);
    
    const attachments = document.querySelector('input[name="attachments"]').files;
    for (let i = 0; i < attachments.length; i++) {
      formData.append('attachments', attachments[i]);
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/tasks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      setIsModalVisibleNew(false);
      toast.success('Task added successfully!');
      console.log('Task added successfully:', response.data);
    } catch (error) {
      console.error('Error adding task:', error.response.data);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
  
    const formData = {
      assignedTo: taskData.assignedTo,
      projectId: taskData.projectId,
      dueDate: taskData.dueDate,
      status: taskData.status,
      pageSize: taskData.pageSize,
      sortBy: taskData.sortBy,
    };
    
    try {
      const response = await axios.post(
        'https://task-manager-backend-btas.onrender.com/api/Assigntask', 
        formData
      );
  
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setIsModalVisible(false);
      toast.success('Task assigned successfully!');
    } catch (error) {
      console.error('Error assigning task:', error.response?.data || error);
      toast.error('Failed to assign task');
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    try {
      if (!taskId) {
        console.error("Task ID is undefined or null.");
        return;
      }
  
      const response = await axios.delete(`https://task-manager-backend-btas.onrender.com/api/tasks/${taskId}`);
      console.log("Delete response:", response.data);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error.message);
    }
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTasks = [...tasks];

    if (result.source.droppableId === result.destination.droppableId) {
      const [movedTask] = updatedTasks.splice(result.source.index, 1);
      updatedTasks.splice(result.destination.index, 0, movedTask);
    } else {
      const [movedTask] = updatedTasks.splice(result.source.index, 1);
      movedTask.statusId = result.destination.droppableId;
      updatedTasks.push(movedTask);
    }

    setTasks(updatedTasks);
  };

  const handleReset = () => {
    setTaskData({
      title: '',
      description: '',
      assignedTo: '',
      projectId: '',
      dueDate: '',
      status: 'pending',
      pageSize: 10,
      sortBy: 'title'
    });
    setAddTask({
      title: '',
      description: '',
      assignedTo: '',
      projectId: '',
      dueDate: '',
      status: 'pending',
      priority: 'low',
      estimateTime: '',
      tags: '',
    });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mt-5 mb-6">
      {error && <p className="text-red-600">{error}</p>}
      <div className="flex bg-gray-100 p-8 justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">TASKS</h1>
        <nav className="flex gap-2 items-center">
          <Button
            onClick={showModal}
            className="bg-yellow-400 w-28 text-white hover:bg-yellow-500 transition"
            title="Assign Task"
          >
            Assign To
          </Button>
          <Button
            onClick={showModalNew}
            className="bg-green-400 text-white hover:bg-yellow-500 transition"
            title="New Task"
          >
            New Task
          </Button>
          <Button
            onClick={handleToggleView}
            className="bg-blue-600 text-white hover:bg-blue-700 transition"
            title="Toggle View"
          >
            {viewType === 'grid' ? 'List View' : 'Grid View'}
          </Button>
        </nav>
      </div>
  
      {/* Add Task Modal */}
      <Modal
        title="Assign Task"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleAssignTask}>
          <div className="mb-4">
            <label htmlFor="assignedTo" className="block mb-1">Assign to:</label>
            <select name="assignedTo" value={taskData.assignedTo} onChange={handleInputChange}>
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="projectId" className="block mb-1">Project:</label>
            <select name="projectId" value={taskData.projectId} onChange={handleInputChange}>
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.title}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="dueDate" className="block mb-1">Due Date:</label>
            <input
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <Button type="submit" className="bg-blue-500 text-white">Assign Task</Button>
        </form>
      </Modal>

      {/* New Task Modal */}
      <Modal
        title="Add New Task"
        visible={isModalVisibleNew}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleAddTask}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-1">Title:</label>
            <input
              type="text"
              name="title"
              value={addTask.title}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-1">Description:</label>
            <ReactQuill
              value={addTask.description}
              onChange={handleInputChange}
              className="border border-gray-300 rounded w-full"
              theme="snow"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="projectId" className="block mb-1">Project:</label>
            <select name="projectId" value={addTask.projectId} onChange={handleInputChange} required>
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.title}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="assignedTo" className="block mb-1">Assign to:</label>
            <select name="assignedTo" value={addTask.assignedTo} onChange={handleInputChange} required>
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="dueDate" className="block mb-1">Due Date:</label>
            <input
              type="date"
              name="dueDate"
              value={addTask.dueDate}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="attachments" className="block mb-1">Attachments:</label>
            <input
              type="file"
              name="attachments"
              multiple
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <Button type="submit" className="bg-blue-500 text-white">Add Task</Button>
        </form>
      </Modal>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tasks" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${viewType === 'list' ? 'flex flex-col' : ''}`}
            >
              {tasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="border border-gray-300 p-4 rounded-lg shadow"
                    >
                      <h2 className="text-xl font-semibold">{task.title}</h2>
                      <p className="text-gray-600">{DOMPurify.sanitize(task.description)}</p>
                      <p className="text-gray-600">Assigned to: {task.assignedTo}</p>
                      <p className="text-gray-600">Due Date: {task.dueDate}</p>
                      <p className="text-gray-600">Status: {statuses[task.statusId]?.title || 'Unknown'}</p>
                      <Button onClick={() => handleDeleteTask(task._id)} className="bg-red-500 text-white mt-2">
                        Delete Task
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Tasks;