import React from "react";
import { motion } from "framer-motion";
import { Dropdown, Menu } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

// importing components
import DropIndicator from "./DropIndicator";
import { useSelector } from "react-redux";

const Card = ({
  title,
  description,
  assignedTo,
  dueDate,
  priority,
  projectId,
  attachments,
  estimateTime,
  tags,
  _id,
  column,
  statusId,
  handleDragStart,
  handleEditTask,
  handleDeleteTask,
  loggedInUser
}) => {
  const handleEditClick = () => {
    handleEditTask({
      title,
      description,
      assignedTo: assignedTo.map((user) => user._id),
      attachments,
      priority,
      dueDate,
      projectId: projectId._id,
      tags,
      estimateTime,
      _id,
    });
  };

  const handleMenuClick = (e) => {
    if (e.key === "edit") {
      handleEditClick();
    } else if (e.key === "delete") {
      handleDeleteTask(_id);
    }
  };

  const { user } = useSelector(
    state => state.user
  );

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="edit" style={{ color: "blue" }}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" style={{ color: "red" }}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <DropIndicator beforeId={_id} column={statusId.name} />
      <motion.div
        layout
        layoutId={_id}
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e, { title, _id, column, statusId })
        }
        className="relative cursor-grab rounded border border-gray-300 bg-white p-3 active:cursor-grabbing"
      >
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

          {
            loggedInUser?.role?.name == "Admin" || loggedInUser?.role?.name == "Manager" && (
              <Dropdown overlay={menu} trigger={["click"]}>
                <EllipsisOutlined className="absolute bottom-2 right-2 text-red-500 hover:text-blue-700 cursor-pointer text-xl font-bold" />
              </Dropdown>
            )
          }


          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-500 text-xs font-medium px-2.5 py-1 rounded-md">
              {statusId.name}
            </span>
          </div>
        </div>
        <div
          className="text-sm text-gray-700 mt-2 mb-4"
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium text-gray-700">Assigned to:</span>{" "}
            {assignedTo.map((i) => i.name).join(", ")}
          </p>
          <p>
            <span className="font-medium text-gray-700">Due Date:</span>{" "}
            {dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Card;
