import React from "react";
import { motion } from "framer-motion";

// importing components
import DropIndicator from "./DropIndicator";

const Card = ({
  title,
  description,
  assignedTo,
  dueDate,
  _id,
  column,
  handleDragStart,
}) => {
  return (
    <>
      <DropIndicator beforeId={_id} column={column} />
      <motion.div
        layout
        layoutId={_id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, _id, column })}
        className="cursor-grab rounded border border-gray-300 bg-white p-3 active:cursor-grabbing"
      >
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-500 text-xs font-medium px-2.5 py-1 rounded-md">
              {column}
            </span>
          </div>
        </div>
        {/* <p className="text-sm text-gray-700 mt-2 mb-4">{description}</p> */}
        <div
          className="text-sm text-gray-700 mt-2 mb-4"
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium text-gray-700">Assigned to:</span>{" "}
            {assignedTo.name}
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
