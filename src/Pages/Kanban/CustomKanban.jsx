import React from "react";

// importing board
import Board from "./Board";

const CustomKanban = ({ loggedInUser }) => {
  return (
    <>
      <div className="h-full w-full bg-white text-neutral-900">
        <Board loggedInUser={loggedInUser} />
      </div>
    </>
  );
};

export default CustomKanban;
