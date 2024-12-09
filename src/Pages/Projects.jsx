import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  Card,
  Progress,
  Avatar,
  Pagination,
} from "antd";
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { server } from "../main";

const { Option } = Select;

const Shimmer = () => {
  return (
    <div className="shimmer-container">
      <div className="shimmer-item"></div>
      <div className="shimmer-item"></div>
      <div className="shimmer-item"></div>
    </div>
  );
};

const Projects = ({ loggedInUser }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const navigate = useNavigate();

  console.log(clients);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    fetchClients();
  }, [currentPage]);

  const fetchProjects = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(`${server}/projectsByUser`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setProjects(Array.isArray(response.data.projects) ? response.data.projects : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      message.error("Failed to fetch projects");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${server}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${server}/users/getAllClients`);
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      message.error("Failed to fetch clients");
    }
  };

  const showModal = (project = null) => {
    if (project) {
      form.setFieldsValue({
        name: project.name,
        prefix: project.prefix,
        client: project.client?._id,
        color: project.color,
        assignees: project.users,
        description: project.description,
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

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing) {
        await axios.put(`${server}/projects/${currentProjectId}`, values);
        message.success("Project updated successfully");
      } else {
        await axios.post(`${server}/projects`, values);
        message.success("Project added successfully");
      }
      fetchProjects();
      handleCancel();
    } catch (error) {
      console.error("Error saving project:", error);
      message.error(
        isEditing ? "Failed to update project" : "Failed to add project"
      );
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`${server}/projects/${projectId}`);
      message.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      message.error("Failed to delete project");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedProjects = projects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleProjectClick = () => {
    navigate("/simpletab");
  };

  return (
    <div className="container py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Projects</h1>
        {loggedInUser?.role?.name === "Admin" || loggedInUser?.role?.name === "Manager" ? (
          <button
            onClick={() => showModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            New Projects +
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          loading ? (
            <Shimmer />
          ) : (
            paginatedProjects.length > 0 ? (
              paginatedProjects.map((project) => (
                <Card
                  key={project._id}
                  className="shadow-lg"
                  title={
                    <div className="flex justify-between items-center">
                      <span>{project.prefix}</span>
                      <span
                        className="text-primary cursor-pointer"
                        onClick={handleProjectClick}
                      >
                        {project.name}
                      </span>
                    </div>
                  }
                  actions={
                    loggedInUser.role.name === "Admin" || loggedInUser.role.name === "Manager"
                      ? [
                        <EditOutlined key="edit" onClick={() => showModal(project)} />,
                        <DeleteOutlined key="delete" onClick={() => deleteProject(project._id)} />,
                      ]
                      : []
                  }
                >
                  <div className="flex justify-between items-center mb-2">
                    <Progress
                      percent={project.progressPercentage || 0}
                      size="small"
                      showInfo={false}
                      strokeColor={project.color || "#3F51B5"}
                    />
                    <span className="text-gray-500">
                      {project.progressPercentage || 0}%
                    </span>
                  </div>

                  <p className="mb-1">
                    <span className="badge badge-primary">{project.status}</span>
                    <span className="float-right">
                      <b>{project.pendingTasks}</b> Pending Task(s)
                    </span>
                  </p>

                  <div className="flex justify-between items-center">
                    <span>Client: {project.client?.name}</span>
                    <div className="flex space-x-2">
                      {Array.isArray(project.assignees) &&
                        project.assignees.map((user) => (
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
            )
          )}
      </div>

      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          total={projects.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

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
            rules={[{ required: true, message: "Please select a client" }]}
          >
            <Select placeholder="Select a client">
              {clients.map((client) => (
                <Option key={client._id} value={client._id}>
                  {client.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Please enter color" }]}
          >
            <Input type="color" />
          </Form.Item>

          <Form.Item
            name="assignees"
            label="Assign Users"
            rules={[{ required: true, message: "Please select users" }]}
          >
            <Select mode="multiple" placeholder="Select users">
              {users.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <ReactQuill theme="snow" placeholder="Enter project description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
