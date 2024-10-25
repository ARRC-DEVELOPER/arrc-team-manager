import React from "react";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

const UserDetails = () => {
  // Static data for demonstration
  const user = {
    name: "Krushna Dike",
    email: "dikekrishna155@gmail.com",
    phone: "9325638959",
    salary: 14999000,
    profilePicture:
      "https://res.cloudinary.com/dlqh7mjvo/image/upload/v1728897014/hh3cyc0s…",
  };

  const performance = {
    totalTasks: 3,
    completedTasks: 1,
    taskCompletionPercentage: "33.33",
    timeEfficiencyPercentage: "100.00",
    overallPerformancePercentage: "100.00",
    averageTimeInHours: "0.05",
    taskStatusCounts: {
      backlog: 0,
      todo: 1,
      doing: 1,
      done: 1,
    },
  };

  const tasks = [
    { title: "Task 1", status: "Done", description: "Complete the setup" },
    { title: "Task 2", status: "Todo", description: "Develop user login" },
    { title: "Task 3", status: "Doing", description: "Implement dashboard" },
  ];

  // Filter tasks
  const completedTasks = tasks.filter((task) => task.status === "Done");
  const pendingTasksList = tasks.filter((task) => task.status !== "Done");

  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen py-8 px-6 space-y-10">
      {/* User Profile and Overview */}
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-8 space-y-6 transition-transform transform hover:scale-105">
        <div className="flex items-center space-x-6">
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-purple-300 shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-bold text-purple-700">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">Phone: {user.phone}</p>
            <p className="text-gray-600">Salary: ₹{user.salary.toLocaleString()}</p>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2 text-purple-600">Performance Overview</h3>
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${performance.taskCompletionPercentage}%` }}
            ></div>
          </div>
          <p className="mt-2 text-gray-700">
            <span className="font-semibold text-blue-600">{performance.taskCompletionPercentage}%</span> of tasks completed
          </p>
        </div>
      </div>

      {/* Task Summary */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 space-y-6 transition-transform transform hover:scale-105">
        <h3 className="text-2xl font-semibold text-purple-600">Task Summary</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="text-4xl font-bold text-gray-900">{performance.totalTasks}</h4>
            <p className="text-gray-500">Assigned Tasks</p>
          </div>
          <div className="text-center">
            <h4 className="text-4xl font-bold text-green-600">{performance.completedTasks}</h4>
            <p className="text-gray-500">Completed</p>
          </div>
          <div className="text-center">
            <h4 className="text-4xl font-bold text-yellow-600">{performance.totalTasks - performance.completedTasks}</h4>
            <p className="text-gray-500">Pending</p>
          </div>
        </div>
      </div>

      {/* Task Lists */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 space-y-6 transition-transform transform hover:scale-105">
        <h3 className="text-2xl font-semibold mb-4 text-purple-600">Tasks</h3>

        <div className="flex gap-5">
          {/* Completed Tasks */}
          <div className="mb-6 w-full">
            <h4 className="text-xl font-semibold mb-2">Completed Tasks</h4>
            {completedTasks.length > 0 ? (
              completedTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-green-100 p-4 rounded-lg mb-2 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center space-x-2">
                    <FaCheckCircle className="text-green-600" />
                    <div>
                      <h4 className="text-lg font-semibold">{task.title}</h4>
                      <p className="text-gray-500">{task.description}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-200 text-green-800">
                    {task.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No completed tasks.</p>
            )}
          </div>

          {/* Pending Tasks */}
          <div className="mb-6 w-full">
            <h4 className="text-xl font-semibold mb-2">Pending Tasks</h4>
            {pendingTasksList.length > 0 ? (
              pendingTasksList.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-yellow-100 p-4 rounded-lg mb-2 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center space-x-2">
                    <FaHourglassHalf className="text-yellow-600" />
                    <div>
                      <h4 className="text-lg font-semibold">{task.title}</h4>
                      <p className="text-gray-500">{task.description}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      task.status === "Doing"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No pending tasks.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
