import React, { useEffect, useState } from "react";
import axios from "axios";

// importing components
import BurnBarrel from "./BurnBarrel";
import Column from "./Column";

// importing data
import { server } from "../../main";
import AddTask from "./AddTask";

const Board = () => {
  const [cards, setCards] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const handleEditTask = (task) => {
    console.log("Editing task: ", task);
    setEditingTask(task);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${server}/tasks/${taskId}`);
      setCards((prev) => prev.filter((c) => c._id !== taskId));
    } catch (error) {
      console.error("Error deleting card", error);
    }
  };

  console.log("Tasks Data: ", cards);
  console.log("Status Data: ", statuses);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${server}/tasks`);
      setCards(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await axios.get(`${server}/statuses`);
      const sortedStatuses = response.data.sort((a, b) => a.order - b.order);
      setStatuses(sortedStatuses);
    } catch (error) {
      console.error("Error fetching statuses", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => { 
      await fetchTasks();
      await fetchStatuses();
    };

    fetchData();
  }, []);

  return (
    <>
      <AddTask
        setCards={setCards}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />

      <div className="flex flex-wrap h-full justify-center align-middle w-full gap-3 overflow-x-auto p-12 space-y-4 md:space-y-0">
        {statuses.map((status) => (
          <Column
            key={status._id}
            statusId={status._id}
            title={status.name}
            column={status.name}
            headingColor={
              status.name === "TODO"
                ? "text-yellow-500"
                : status.name === "In Progress"
                ? "text-blue-500"
                : status.name === "Complete"
                ? "text-emerald-500"
                : "text-neutral-500"
            }
            cards={cards}
            setCards={setCards}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
          />
        ))}
        {/* <BurnBarrel setCards={setCards} /> */}
      </div>
    </>
  );
};

export default Board;
