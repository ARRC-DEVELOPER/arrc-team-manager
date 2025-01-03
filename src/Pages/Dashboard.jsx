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
import "tailwindcss/tailwind.css";
import { useNavigate } from "react-router-dom";
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
  const [overallStats, setOverAllStats] = useState();
  const [taskStats, seTaskStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOverAllStats();
    fetchRecentAcitivities();
    fetchOverAllUserStats();
  }, []);

  const fetchOverAllStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/stats/getOverallStats`);
      setOverAllStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch overallstats");
    }
  };

  const fetchOverAllUserStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/stats/getUserTaskStats`);
      seTaskStats(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch user Stats");
    }
  };

  const fetchRecentAcitivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/stats/recent-activities`);
      setRecentActivities(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch recent activities");
    }
  };

  const labels = taskStats.map((user) => user.name);

  // console.log(taskStats);

  const completedData = taskStats.map((user) => user.completedCount);
  const ongoingData = taskStats.map((user) => user.ongoingCount);
  const pendingData = taskStats.map((user) => user.pendingCount);


  const barData = {
    labels,
    datasets: [
      {
        label: "Completed",
        data: completedData,
        backgroundColor: "rgb(76, 175, 80)", // Specific green color
        borderWidth: 0,
        borderRadius: 4,
      },
      {
        label: "Ongoing",
        data: ongoingData,
        backgroundColor: "rgb(3, 169, 244)", // Specific blue color
        borderWidth: 0,
        borderRadius: 4,
      },
      {
        label: "Pending",
        data: pendingData,
        backgroundColor: "rgb(255, 152, 0)", // Specific orange color
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  const doughnutData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [
          (overallStats && overallStats.priorityCounts.high) || 0,
          (overallStats && overallStats.priorityCounts.medium) || 0,
          (overallStats && overallStats.priorityCounts.low) || 0,
        ],
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

  if ((loading, !overallStats)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-4">
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
          <p className="text-4xl font-semibold mt-2">
            {overallStats.totalTasks || "0"}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">Completed Tasks</h2>
          <p className="text-4xl font-semibold mt-2">
            {overallStats.completedTasks || "0"}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">Pending Tasks</h2>
          <p className="text-4xl font-semibold mt-2">
            {overallStats.pendingTasks || "0"}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">Overdue Tasks</h2>
          <p className="text-4xl font-semibold mt-2">
            {overallStats.overdueTasks || "0"}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      {/* Bar Chart */}
      <div className="bg-white p-4 mt-6 rounded shadow">
        <h3 className="text-lg font-bold mb-4">Task Status Overview</h3>
        <div className="w-full max-w-6xl mx-auto h-64 md:h-96">
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  beginAtZero: true,
                  max: 1.0,
                  ticks: {
                    stepSize: 0.1,
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                },
              },
              plugins: {
                legend: {
                  position: 'top',
                  align: 'center',
                  labels: {
                    usePointStyle: true,
                    padding: 20,
                  },
                },
              },
              barPercentage: 0.8,
              categoryPercentage: 0.9,
            }}
          />
        </div>
      </div>



      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Doughnut Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4 text-center">Task Priority Breakdown</h3>
          <div className="w-full h-auto md:w-[400px] md:h-[400px] mx-auto">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* Line Chart for User Performance */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4 text-center">User Performance Over Time</h3>
          <div className="w-full h-auto md:w-[500px] md:h-[400px] mx-auto">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>


      {/* Recent Activities */}
      <div className="mt-6 bg-white p-4 md:p-6 rounded shadow">
        <h3 className="text-lg md:text-xl font-bold mb-4">Recent Activities</h3>
        <ul className="space-y-2">
          {recentActivities &&
            recentActivities.map((item, index) => (
              <li
                key={index}
                className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-1 md:space-y-0"
              >
                <span className="text-sm md:text-base">{item.message}</span>
                <span className="text-xs md:text-sm text-gray-500">{item.timeAgo}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

