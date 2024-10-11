import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Input, Select, message, Card, Progress, Avatar, Pagination } from "antd";
import { EllipsisOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill"; // Import ReactQuill for the description field
import "react-quill/dist/quill.snow.css"; // Import styles for ReactQuill
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const { Option } = Select;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]); // State to store users
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1); // Track pagination page
  const [pageSize] = useState(6); // Set the page size (6 projects per page)
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch projects and users from the backend
  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, [currentPage]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("https://task-manager-backend-btas.onrender.com/api/projects");
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      message.error("Failed to fetch projects");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://task-manager-backend-btas.onrender.com/api/users");
      setUsers(response.data); // Assuming response.data is an array of users
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
    }
  };

  // Open the form modal
  const showModal = (project = null) => {
    if (project) {
      form.setFieldsValue({
        name: project.name,
        prefix: project.prefix,
        client: project.client,
        color: project.color,
        assignees: project.users,
        description: project.description, // Set description for editing
      });
      setCurrentProjectId(project._id);
      setIsEditing(true);
    } else {
      form.resetFields();
      setCurrentProjectId(null);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  // Submit the new project or edited project
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing) {
        await axios.put(`https://task-manager-backend-btas.onrender.com/api/projects/${currentProjectId}`, values);
        message.success("Project updated successfully");
      } else {
        await axios.post("https://task-manager-backend-btas.onrender.com/api/projects", values);
        message.success("Project added successfully");
      }
      fetchProjects(); // Refresh project list
      handleCancel();
    } catch (error) {
      console.error("Error saving project:", error);
      message.error(isEditing ? "Failed to update project" : "Failed to add project");
    }
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`https://task-manager-backend-btas.onrender.com/api/projects/${projectId}`);
      message.success("Project deleted successfully");
      fetchProjects(); // Refresh project list
    } catch (error) {
      console.error("Error deleting project:", error);
      message.error("Failed to delete project");
    }
  };

  // Handle pagination page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Paginate the projects to display
  const paginatedProjects = projects.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  const handleProjectClick = () => {
    navigate("/simpletab"); // Navigate to /simpletab
  };

  return (
    <div className="container py-4">
      {/* <h1 className="text-2xl font-bold mb-4 text-gray-800">Projects</h1>
      {/* <Button type="primary" className="mb-4" onClick={() => showModal()}>
        New Project
      </Button> */}
      {/* <div className="flex justify-end">
  <Button type="primary" className="mb-4" onClick={() => showModal()}>
    New Project
  </Button>
</div> */} 
<div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button onClick={() => showModal()} className="px-4 py-2 bg-blue-600 text-white rounded">
          New Projects +
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedProjects.length > 0 ? (
          paginatedProjects.map((project) => (
            <Card
              key={project._id}
              className="shadow-lg"
              title={
                <div className="flex justify-between items-center">
                  <span>{project.prefix}</span>
                  <span className="text-primary cursor-pointer" onClick={handleProjectClick}>
                    {project.name}
                  </span>
                </div>
              }
              actions={[
                <EditOutlined key="edit" onClick={() => showModal(project)} />,
                <DeleteOutlined key="delete" onClick={() => deleteProject(project._id)} />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <div className="flex justify-between items-center mb-2">
                <Progress
                  percent={project.progressPercentage || 0}
                  size="small"
                  showInfo={false}
                  strokeColor={project.color || "#3F51B5"}
                />
                <span className="text-gray-500">{project.progressPercentage || 0}%</span>
              </div>

              <p className="mb-1">
                <span className="badge badge-primary">{project.status}</span>
                <span className="float-right">
                  <b>{project.pendingTasks}</b> Pending Task(s)
                </span>
              </p>

              <div className="flex justify-between items-center">
                <span>Client: {project.client}</span>
                <div className="flex space-x-2">
                  {Array.isArray(project.assignees) && project.assignees.map((user) => (
                    <Avatar
                      key={user}
                      src={`https://ui-avatars.com/api/?name=${user}&size=64&rounded=true&color=fff&background=random`}
                      alt={user}
                    />
                  ))}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p>No projects available.</p>
        )}
      </div>

      {/* Pagination Component */}
      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          total={projects.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false} // Hide page size changer
        />
      </div>

      {/* New/Edit Project Form Modal */}
      <Modal
        title={isEditing ? "Edit Project" : "New Project"}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isEditing ? "Update" : "Submit"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: "Please enter project name" }]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>

          <Form.Item
            name="prefix"
            label="Prefix"
            rules={[{ required: true, message: "Please enter project prefix" }]}
          >
            <Input placeholder="Enter project prefix" />
          </Form.Item>

          <Form.Item
            name="client"
            label="Client"
            rules={[{ required: true, message: "Please enter client name" }]}
          >
            <Input placeholder="Enter client name" />
          </Form.Item>

          {/* Color Picker */}
          <Form.Item name="color" label="Color">
            <input
              type="color"
              onChange={(e) => form.setFieldsValue({ color: e.target.value })} // Set color value
              className="rounded w-16 h-10 border border-gray-300"
            />
          </Form.Item>

          {/* Users Dropdown */}
          <Form.Item
            name="assignees"
            label="Assign Users"
            rules={[{ required: true, message: "Please select users" }]}
          >
            <Select mode="multiple" placeholder="Select users">
              {users.map((user) => (
                <Option key={user._id} value={user.username}>{user.username}</Option>
              ))}
            </Select>
          </Form.Item>

          {/* Description Field */}
          <Form.Item
            name="description"
            label="Description"
          >
            <ReactQuill
              placeholder="Add project description"
              theme="snow"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
