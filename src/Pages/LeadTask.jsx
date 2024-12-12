// USER

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Select, DatePicker, Input, notification, Button } from "antd";
import * as XLSX from "xlsx";
import { server } from "../main";
import moment from "moment";

const { Option } = Select;

const LeadTask = () => {
  const [leads, setLeads] = useState([]);
  const [lead, setLead] = useState("");

  useEffect(() => {
    fetchLeads();
    const storedLeads = localStorage.getItem("leads");
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    }
  }, []);

  const fetchLeads = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(`${server}/leads/getMyLeads`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      console.log(response);

      if (response.data.success) {
        setLeads(response.data.leads);
        setLead(response.data.lead);
      } else {
        notification.error({ message: response.data.message });
        setLeads([]);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      notification.error({ message: "Failed to fetch leads" });
    }
  };

  const handleUpdateSheet = async () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(leads);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

      const excelBinaryString = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "binary",
      });

      const arrayBuffer = new ArrayBuffer(excelBinaryString.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < excelBinaryString.length; i++) {
        view[i] = excelBinaryString.charCodeAt(i) & 0xff;
      }

      const excelBlob = new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const formData = new FormData();
      formData.append("file", new File([excelBlob], lead.originalName));

      const token = localStorage.getItem("authToken");

      const response = await axios.put(
        `${server}/leads/updateLeadFile/${lead[0]._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        notification.success({ message: "Lead file updated successfully" });
        localStorage.removeItem("leads");
      } else {
        notification.error({ message: response.data.message });
      }
    } catch (error) {
      console.error("Error updating lead file:", error);
      notification.error({ message: "Failed to update lead file" });
    }
  };

  const handleStatusChange = (value, record, index) => {
    const updatedLeads = [...leads];
    updatedLeads[index].Status = value;
    setLeads(updatedLeads);
    localStorage.setItem("leads", JSON.stringify(updatedLeads));
  };

  const handleEditableChange = (key, value, index) => {
    const updatedLeads = [...leads];
    updatedLeads[index][key] = value;
    setLeads(updatedLeads);
    localStorage.setItem("leads", JSON.stringify(updatedLeads));
  };

  const columns = [
    {
      title: "Client Name",
      dataIndex: "Calinet Name",
      key: "clientName",
    },
    {
      title: "Mobile Number",
      dataIndex: "Mobile Number",
      key: "mobileNumber",
    },
    {
      title: "City",
      dataIndex: "City",
      key: "city",
    },
    {
      title: "Calling Purpose",
      dataIndex: "Calling Purpose",
      key: "callingPurpose",
      render: (text, record, index) => (
        <Input
          defaultValue={text}
          onChange={(e) =>
            handleEditableChange("Calling Purpose", e.target.value, index)
          }
        />
      ),
    },
    {
      title: "Calling Date",
      dataIndex: "Calling Date",
      key: "callingDate",
      render: (date, record, index) => (
        <DatePicker
          defaultValue={moment(date)}
          onChange={(date) =>
            handleEditableChange(
              "Calling Date",
              date ? date.toISOString() : null,
              index
            )
          }
        />
      ),
    },
    {
      title: "Follow-up Date",
      dataIndex: "Follow-up Date",
      key: "followUpDate",
      render: (date, record, index) => (
        <DatePicker
          defaultValue={moment(date)}
          onChange={(date) =>
            handleEditableChange(
              "Follow-up Date",
              date ? date.toISOString() : null,
              index
            )
          }
        />
      ),
    },
    {
      title: "Question",
      dataIndex: "Question",
      key: "question",
      render: (text, record, index) => (
        <Input
          defaultValue={text}
          onChange={(e) =>
            handleEditableChange("Question", e.target.value, index)
          }
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "status",
      render: (text, record, index) => (
        <Select
          defaultValue={record.Status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(value, record, index)}
        >
          <Option value="Not Answered">Not Answered</Option>
          <Option value="Rejected">Rejected</Option>
          <Option value="Accepted">Accepted</Option>
          <Option value="Call Back">Call Back</Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <h2>Leads</h2>
        <Button
          type="primary"
          onClick={handleUpdateSheet}
          style={{ marginBottom: 16 }}
        >
          Update Sheet
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={leads}
        rowKey={(record) => record._id || record["Mobile Number"]}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "100%" }}
      />
    </div>
  );
};

export default LeadTask;
