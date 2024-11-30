import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Progress, message } from "antd";
import { server } from "../main";

const UserDetails = () => {
  const [user, setUser] = useState();
  const [performance, setPerformance] = useState();
  const [tasks, setTasks] = useState();
  const [loading, setLoading] = useState(true);
  const [animatedTaskCompletion, setAnimatedTaskCompletion] = useState(0);
  const [animatedTimeEfficiency, setAnimatedTimeEfficiency] = useState(0);
  const [animatedOverallPerformance, setAnimatedOverallPerformance] =
    useState(0);
  const { userId } = useParams();

  useEffect(() => {
    fetchUser();
    fetchUserPerformance();
    fetchUserTasks();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/users/${userId}`);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch users");
    }
  };

  const fetchUserPerformance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${server}/calculateUserPerformance/${userId}`
      );
      setPerformance(response.data);
      setLoading(false);

      // Animate performance data
      animateProgress(response.data);
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch user performance");
    }
  };

  const fetchUserTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/tasks/user/${userId}`);
      setTasks(response.data.tasks);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch user performance");
    }
  };

  // Filter tasks
  const completedTasks =
    (tasks && tasks.filter((task) => task.statusId.name === "Complete")) || 0;
  const pendingTasksList =
    (tasks && tasks.filter((task) => task.statusId.name !== "Complete")) || 0;

  const animateProgress = (data) => {
    if (!data) return;

    const animate = (setAnimatedValue, targetValue) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        setAnimatedValue(progress);
        if (progress >= targetValue) {
          clearInterval(interval);
        }
      }, 20);
    };

    animate(setAnimatedTaskCompletion, data.taskCompletionPercentage);
    animate(setAnimatedTimeEfficiency, data.timeEfficiencyPercentage);
    animate(setAnimatedOverallPerformance, data.overallPerformancePercentage);
  };

  if ((loading, !user, !performance, !tasks)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen py-8 px-6 space-y-10">
      {/* User Profile and Overview */}
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-8 space-y-6 transition-transform transform hover:scale-105">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-purple-300 shadow-lg"
          />
          <div className="mt-4 sm:mt-0">
            <h2 className="text-3xl font-bold text-purple-700">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">Phone: {user.phone}</p>
            <p className="text-gray-600">
              Salary: ₹{user.salary.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Performance bar */}
        <div className="mt-6">
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{
                width: `${animatedTaskCompletion}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-8 space-y-6 transform hover:scale-105">
        <h3 className="text-2xl font-semibold text-purple-600">Performance Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Task Completion */}
          <div className="text-center">
            <Progress
              type="circle"
              percent={animatedTaskCompletion}
              strokeColor="#3b82f6"
              format={(percent) => `${percent}%`}
              width={80}
            />
            <p className="mt-2 text-gray-700">Task Completion</p>
          </div>

          {/* Time Efficiency */}
          <div className="text-center">
            <Progress
              type="circle"
              percent={animatedTimeEfficiency}
              strokeColor="#10b981"
              format={(percent) => `${percent}%`}
              width={80}
            />
            <p className="mt-2 text-gray-700">Time Efficiency</p>
          </div>

          {/* Overall Performance */}
          <div className="text-center">
            <Progress
              type="circle"
              percent={animatedOverallPerformance}
              strokeColor="#fbbf24"
              format={(percent) => `${percent}%`}
              width={80}
            />
            <p className="mt-2 text-gray-700">Overall Performance</p>
          </div>
        </div>
      </div>

      {/* Task Summary */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 space-y-6 transition-transform transform hover:scale-105">
        <h3 className="text-2xl font-semibold text-purple-600">Task Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="text-4xl font-bold text-gray-900">
              {performance.totalTasks}
            </h4>
            <p className="text-gray-500">Assigned Tasks</p>
          </div>
          <div className="text-center">
            <h4 className="text-4xl font-bold text-green-600">
              {performance.completedTasks}
            </h4>
            <p className="text-gray-500">Completed</p>
          </div>
          <div className="text-center">
            <h4 className="text-4xl font-bold text-yellow-600">
              {performance.totalTasks - performance.completedTasks}
            </h4>
            <p className="text-gray-500">Pending</p>
          </div>
        </div>
      </div>

      {/* Task Lists */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 space-y-6 transition-transform transform hover:scale-105">
        <h3 className="text-2xl font-semibold mb-4 text-purple-600">Tasks</h3>

        <div className="flex flex-col sm:flex-row gap-5">
          {/* Completed Tasks */}
          <div className="mb-6 w-full">
            <h4 className="text-xl font-semibold mb-2">Completed Tasks</h4>
            {completedTasks.length > 0 ? (
              completedTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-green-100 p-4 rounded-lg mb-2 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center space-x-5">
                    <FaCheckCircle className="text-green-600" />
                    <div>
                      <h4 className="text-lg font-semibold">{task.title}</h4>
                      <p
                        className="text-gray-500"
                        dangerouslySetInnerHTML={{ __html: task.description }}
                      ></p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-200 text-green-800">
                    {task.statusId.name}
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
                  <div className="flex items-center space-x-5">
                    <FaHourglassHalf className="text-yellow-600" />
                    <div>
                      <h4 className="text-lg font-semibold">{task.title}</h4>
                      <p
                        className="text-gray-500"
                        dangerouslySetInnerHTML={{ __html: task.description }}
                      ></p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-200 text-yellow-800">
                    {task.statusId.name}
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
