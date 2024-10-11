import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

// importing icons
import { FiPlus } from "react-icons/fi";
import { server } from "../../main";

const AddCard = ({ column, setCards }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
    };

    try {
      const response = await axios.post(`${server}/tasks/addNewTask`, newCard);
      setCards((prev) => [...prev, response.data.savedCard]);
    } catch (error) {
      console.error("Error adding card", error);
    }

    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-blue-400 bg-blue-50 p-3 text-sm text-neutral-900 placeholder-blue-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-900 px-3 py-1.5 text-xs text-white transition-colors hover:bg-neutral-700"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};

export default AddCard;
