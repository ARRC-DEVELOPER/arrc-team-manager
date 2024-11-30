import React, { useEffect, useState } from "react";
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
import   
 "tailwindcss/tailwind.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../main";

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
  // ... (rest of the code)

  return (
    <div className="p-4">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">Task Manager Dashboard</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          <Link to="/tasks-data">Create Task</Link>
        </button>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Summary Cards */}

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}

        </div>

        {/* Line Chart for User Performance */}
        <div className="bg-white mt-5 p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4">User Performance Over Time</h3>
        </div>

        {/* Recent Activities */}
        <div className="bg-white mt-5 p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4">Recent Activities</h3>
          <ul className="space-y-2">
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;