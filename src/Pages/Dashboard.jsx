import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import "tailwindcss/tailwind.css";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const barData = {
    labels: ["User A", "User B", "User C", "User D"],
    datasets: [
      {
        label: "Completed",
        data: [10, 7, 6, 9],
        backgroundColor: "#4CAF50", // Green for completed
        borderWidth: 1,
      },
      {
        label: "Ongoing",
        data: [3, 5, 4, 6],
        backgroundColor: "#03A9F4", // Blue for ongoing
        borderWidth: 1,
      },
      {
        label: "Pending",
        data: [2, 3, 4, 1],
        backgroundColor: "#FF9800", // Orange for pending
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [6, 10, 4],
        backgroundColor: ["#F44336", "#FFEB3B", "#4CAF50"],
        hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "User A",
        data: [3, 7, 10, 12],
        borderColor: "#4CAF50",
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#4CAF50",
      },
      {
        label: "User B",
        data: [2, 6, 8, 11],
        borderColor: "#FF9800",
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#FF9800",
      },
      {
        label: "User C",
        data: [1, 4, 6, 8],
        borderColor: "#03A9F4",
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#03A9F4",
      },
      {
        label: "User D",
        data: [4, 5, 9, 12],
        borderColor: "#F44336",
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#F44336",
      },
    ],
  };

  const handleCreateTask = () => {
    navigate("/tasks-data");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-gray-700">
          Task Manager Dashboard
        </h1>
        <button
          onClick={handleCreateTask}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Task
        </button>
      </header>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Summary Cards */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">Total Tasks</h2>
          <p className="text-4xl font-semibold mt-2">45</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">Completed Tasks</h2>
          <p className="text-4xl font-semibold mt-2">12</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">Pending Tasks</h2>
          <p className="text-4xl font-semibold mt-2">8</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">Overdue Tasks</h2>
          <p className="text-4xl font-semibold mt-2">2</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4">Task Status Overview</h3>
          <Bar data={barData} />
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4">Task Priority Breakdown</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>

      {/* Line Chart for User Performance */}
      <div className="bg-white mt-5 p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-4">User Performance Over Time</h3>
        <Line data={lineData} />
      </div>

      {/* Recent Activities */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-4">Recent Activities</h3>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>Task 1 - Completed</span>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </li>
          <li className="flex justify-between">
            <span>Task 2 - Assigned to User A</span>
            <span className="text-sm text-gray-500">4 hours ago</span>
          </li>
          <li className="flex justify-between">
            <span>Task 3 - Overdue</span>
            <span className="text-sm text-gray-500">1 day ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
