import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  Form,
  Row,
  Col,
  Upload,
  Select,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import "../../Components/css/Shimmer.css"; // For shimmer effect
import { server } from "../../main";

const { Option } = Select;

const Settings = () => {
  const [open, setOpen] = useState(false); // Control modal visibility
  const [loading, setLoading] = useState(false); // Handle form submission loading
  const [fetchingStatuses, setFetchingStatuses] = useState(false); // Handle task status fetching
  const [statuses, setStatuses] = useState([]); // Store task statuses from API
  const [formType, setFormType] = useState("general"); // Control the form type (general/recaptcha)

  const [formData, setFormData] = useState({
    appName: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    workingDays: "",
    workingHours: "",
    address: "",
    appLogo: null,
    favicon: null,
    taskStatus: "",
    recaptchaSiteKey: "",
    recaptchaSecretKey: "",
  });

  // Open modal and set form type
  const handleOpen = (type) => {
    setFormType(type);
    setOpen(true);
    if (type === "general") {
      fetchTaskStatuses(); // Fetch task statuses when general form is opened
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${server}/settings`);
        if (response.data) {
          setFormData(response.data);
        } else {
          // Handle the case where there's no data
          setFormData({
            appName: "",
            companyName: "",
            companyEmail: "",
            companyPhone: "",
            workingDays: "",
            workingHours: "",
            address: "",
            appLogo: null,
            favicon: null,
            taskStatus: "",
            recaptchaSiteKey: "",
            recaptchaSecretKey: "",
          });
        }
      } catch (error) {
        message.error("Failed to fetch settings");
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Submit form data to your API endpoint
      await axios.post(`${server}/settings`, data);

      message.success("Settings saved successfully!");
      setOpen(false); // Close modal on success
    } catch (error) {
      message.error("Failed to save settings");
      console.error("Error submitting the form:", error);
    } finally {
      setLoading(false);
    }
  };

  // Close modal and reset form type
  const handleClose = () => {
    setOpen(false);
    setFormType("general"); // Reset to default
  };

  // Fetch task statuses from API
  const fetchTaskStatuses = async () => {
    setFetchingStatuses(true);
    try {
      const response = await axios.get(`${server}/statuses`);
      setStatuses(response.data); // Update status options in form
    } catch (error) {
      message.error("Failed to fetch task statuses");
      console.error("Error fetching statuses:", error);
    } finally {
      setFetchingStatuses(false);
    }
  };

  // Handle input changes for all form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select dropdown change
  const handleStatusChange = (value) => {
    setFormData({ ...formData, taskStatus: value });
  };

  // Handle file upload changes for appLogo and favicon
  const handleFileChange = ({ file }, name) => {
    setFormData({ ...formData, [name]: file });
  };

  // Handle form submission for saving data
  // const handleSubmit = async () => {
  //   setLoading(true);
  //   try {
  //     // Prepare form data for submission
  //     const data = new FormData();
  //     Object.keys(formData).forEach((key) => {
  //       data.append(key, formData[key]);
  //     });

  //     // Submit form data to your API endpoint
  //     await axios.post('your-api-endpoint', data);

  //     message.success('Settings saved successfully!');
  //     setOpen(false); // Close modal on success
  //   } catch (error) {
  //     message.error('Failed to save settings');
  //     console.error('Error submitting the form:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Render the invoice template mock data (this is just an example for UI demo purposes)
  const renderInvoiceTemplate = () => {
    const invoiceData = {
      invoiceNumber: "#63GK94",
      issueDate: "25 Nov 2020 8:03 AM",
      from: {
        name: "InfyOmLabs",
        location: "Surat",
        phone: "26878307170",
      },
      to: {
        projectName: "<Project Name>",
        clientName: "<Client Name>",
        clientEmail: "<Client Email>",
      },
      tasks: [
        { task: "Task 1", hours: "04:5 H", amount: "$100.00" },
        { task: "Task 2", hours: "04:5 H", amount: "$100.00" },
        { task: "Task 3", hours: "04:5 H", amount: "$100.00" },
      ],
      amount: "$300.00",
      discount: "$50.00",
      tax: "0%",
      total: "$250.00",
      regards: "InfyOmLabs",
    };

    return (
      <div>
        <h3>INVOICE</h3>
        <p>
          <strong>Invoice No:</strong> {invoiceData.invoiceNumber}
        </p>
        <p>
          <strong>Issue Date:</strong> {invoiceData.issueDate}
        </p>
        <Row gutter={16}>
          <Col span={12}>
            <p>
              <strong>From:</strong>
            </p>
            <p>{invoiceData.from.name}</p>
            <p>{invoiceData.from.location}</p>
            <p>Mo: {invoiceData.from.phone}</p>
          </Col>
          <Col span={12}>
            <p>
              <strong>To:</strong>
            </p>
            <p>{invoiceData.to.projectName}</p>
            <p>{invoiceData.to.clientName}</p>
            <p>{invoiceData.to.clientEmail}</p>
          </Col>
        </Row>
        <table
          style={{
            width: "100%",
            marginTop: "16px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>#</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Task</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Hours
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Task Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.tasks.map((task, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {index + 1}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {task.task}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {task.hours}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {task.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Row gutter={16} style={{ marginTop: "16px" }}>
          <Col span={24}>
            <p>
              <strong>Amount:</strong> {invoiceData.amount}
            </p>
            <p>
              <strong>Discount:</strong> {invoiceData.discount}
            </p>
            <p>
              <strong>Tax:</strong> {invoiceData.tax}
            </p>
            <p>
              <strong>Total:</strong> {invoiceData.total}
            </p>
          </Col>
        </Row>
        <p>
          <strong>Regards:</strong> {invoiceData.regards}
        </p>
      </div>
    );
  };

  return (
    <div className="p-5">
      {/* Buttons to open different settings modals */}
      {formType === "general" && (
        <div className="flex flex-wrap gap-2 justify-end mb-4 space-x-4">
          <Button type="primary" onClick={() => handleOpen("general")}>
            General
          </Button>
          <Button type="primary" onClick={() => setFormType("invoice")}>
            Invoice Template
          </Button>
          <Button type="primary" onClick={() => handleOpen("recaptcha")}>
            Google Recaptcha
          </Button>
        </div>
      )}

      {/* Modal for general or recaptcha settings */}
      <Modal
        title={
          formType === "recaptcha" ? "Google Recaptcha Settings" : "Settings"
        }
        visible={open}
        onCancel={handleClose}
        footer={null}
        confirmLoading={loading}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          {formType === "general" ? (
            <>
              {/* General Settings Form */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="App Name" required>
                    <Input
                      name="appName"
                      value={formData.appName}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Company Name" required>
                    <Input
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Company Email" required>
                    <Input
                      name="companyEmail"
                      type="email"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Company Phone" required>
                    <Input
                      name="companyPhone"
                      value={formData.companyPhone}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Working Days of Month" required>
                    <Input
                      name="workingDays"
                      value={formData.workingDays}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Working Hours of Day" required>
                    <Input
                      name="workingHours"
                      value={formData.workingHours}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Address">
                    <Input.TextArea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="App Logo">
                    <Upload
                      name="appLogo"
                      listType="picture"
                      beforeUpload={() => false} // Prevent automatic upload
                      onChange={(info) => handleFileChange(info, "appLogo")}
                    >
                      <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Favicon">
                    <Upload
                      name="favicon"
                      listType="picture"
                      beforeUpload={() => false}
                      onChange={(info) => handleFileChange(info, "favicon")}
                    >
                      <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Task Status">
                    <Select
                      placeholder="Select a task status"
                      value={formData.taskStatus}
                      onChange={handleStatusChange}
                      loading={fetchingStatuses}
                    >
                      {statuses.map((status) => (
                        <Option key={status._id} value={status._id}>
                          {status.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </>
          ) : (
            <>
              {/* Google Recaptcha Settings Form */}
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Site Key" required>
                    <Input
                      name="recaptchaSiteKey"
                      value={formData.recaptchaSiteKey}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Secret Key" required>
                    <Input
                      name="recaptchaSecretKey"
                      value={formData.recaptchaSecretKey}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          <Form.Item>
            <div className="flex justify-end">
              <Button onClick={handleClose} style={{ marginRight: "8px" }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Render Invoice Template in a separate modal */}
      {formType === "invoice" && renderInvoiceTemplate()}
    </div>
  );
};

export default Settings;
