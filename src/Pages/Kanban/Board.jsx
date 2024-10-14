import React, { useEffect, useState } from "react";
import axios from "axios";

// importing compoentns
import BurnBarrel from "./BurnBarrel";
import Column from "./Column";

// importing data
// import DEFAULT_CARDS from "./data";
import { server } from "../../main";
import AddTask from "./AddTask";

const Board = () => {
  const [cards, setCards] = useState([]);
  const [statuses, setStatuses] = useState([]);

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
      <AddTask setCards={setCards} />

      {/* <div className="flex h-full w-full gap-3 overflow-scroll p-12">
        <Column
          title="Backlog"
          column="backlog"
          headingColor="text-neutral-500"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="TODO"
          column="todo"
          headingColor="text-yellow-500"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="In progress"
          column="doing"
          headingColor="text-blue-500"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Complete"
          column="done"
          headingColor="text-emerald-500"
          cards={cards}
          setCards={setCards}
        />
        <BurnBarrel setCards={setCards} />
      </div> */}

      <div className="flex h-full w-full gap-3 overflow-scroll p-12">
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
          />
        ))}
        <BurnBarrel setCards={setCards} />
      </div>
    </>
  );
};

export default Board;
