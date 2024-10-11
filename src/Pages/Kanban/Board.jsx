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

  console.log(cards);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(`${server}/tasks`);
        setCards(response.data);
      } catch (error) {
        console.error("Error fetching cards", error);
      }
    };

    fetchCards();
  }, []);

  return (
    <>
      <AddTask setCards={setCards} />
      <div className="flex h-full w-full gap-3 overflow-scroll p-12">
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
      </div>
    </>
  );
};

export default Board;
