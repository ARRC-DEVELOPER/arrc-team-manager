import React from "react";

// importing board
import Board from "./Board";

const CustomKanban = () => {
  return (
    <>
      <div className="h-full w-full bg-white text-neutral-900">
        <Board />
      </div>
    </>
  );
};

export default CustomKanban;
