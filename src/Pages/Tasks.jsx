import React from "react";
import CustomKanban from "./Kanban/CustomKanban.jsx";

const Tasks = ({ loggedInUser }) => {  
  return (
    <div className="p-4 mt-5 mb-6">
      <CustomKanban loggedInUser={loggedInUser} />
    </div>
  );
};

export default Tasks;
