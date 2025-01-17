import React, { useState } from "react";
import axios from "axios";

// importing components
import DropIndicator from "./DropIndicator";
import Card from "./Card";
import { server } from "../../main";

const Column = ({
  title,
  headingColor,
  statusId,
  cards,
  column,
  setCards,
  handleEditTask,
  handleDeleteTask,
  loggedInUser,
}) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card._id);
  };

  const handleDragEnd = async (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c._id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, statusId };

      copy = copy.filter((c) => c._id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el._id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      console.log(copy);
      setCards(copy);

      try {
        const updatedCard = await axios.put(
          `${server}/tasks/updateCardColumn/${cardId}`,
          {
            statusId,
          }
        );

        console.log("Card updated: ", updatedCard);

        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${server}/getTasks`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setCards(response.data);
      } catch (err) {
        console.error("Error updating card:", err);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((card) => card.statusId._id == statusId);

  return (
    <div className="w-full sm:w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-500">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${active ? "bg-gray-100" : "bg-gray-50"
          }`}
      >
        {filteredCards.map((c) => {
          return (
            <Card
              key={c._id}
              {...c}
              handleDragStart={handleDragStart}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              loggedInUser={loggedInUser}
            />
          );
        })}
        <DropIndicator beforeId={null} column={column} />
      </div>
    </div>
  );
};

export default Column;
