import axios from "axios";
import React, { useState } from "react";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { server } from "../../main";

const BurnBarrel = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = async (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    try {
      await axios.delete(`${server}/tasks/${cardId}`);
      setCards((prev) => prev.filter((c) => c._id !== cardId));
    } catch (error) {
      console.error("Error deleting card", error);
    }

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-500 bg-red-500/20 text-red-600"
          : "border-gray-300 bg-gray-100 text-gray-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

export default BurnBarrel;
