import React, { useEffect, useState } from "react";
import axios from "axios";

// importing components
import BurnBarrel from "./BurnBarrel";
import Column from "./Column";

// importing data
import { server } from "../../main";
import AddTask from "./AddTask";
import { useSelector } from "react-redux";

const Board = ({ loggedInUser }) => {
  const [cards, setCards] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserChange = (event) => {
    const userId = event.target.value;

    console.log(userId);
    setSelectedUser(userId);
    fetchTasks(userId);
  };

  const fetchUsers = async () => {
    try {
      const usersResponse = await axios.get(`${server}/users`);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleEditTask = (task) => {
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

  const fetchTasks = async (userId = null) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `${server}/getTasks${userId ? `?userId=${userId}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
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
      await fetchUsers();
    };

    fetchData();
  }, []);

  const { user } = useSelector(
    state => state.user
  );

  return (
    <>
      {
        loggedInUser?.role?.name == "Admin" || loggedInUser?.role?.name == "Manager" ? (
          <>
            <AddTask
              setCards={setCards}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
            />

            <div className="w-[90%] m-auto">
              <select
                className="bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                value={selectedUser || ""}
                onChange={handleUserChange}
              >
                <option value="" className="text-gray-500">
                  All Users
                </option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <></>
        )
      }


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
            loggedInUser={loggedInUser}
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