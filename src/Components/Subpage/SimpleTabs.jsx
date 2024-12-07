import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from "../../main.jsx";

const SimpleTabs = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [projectData, setProjectData] = useState(null);
  const [users, setUsers] = useState([]);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project data from API
        const projectResponse = await axios.get(`${server}/projects`);
        setProjectData(projectResponse.data[0]); // Assuming first project

        // Fetch users (members) from API
        const usersResponse = await axios.get(`${server}/users`);
        setUsers(usersResponse.data); // Set all users

        // Fetch client data from API
        const clientResponse = await axios.get('https://task-manager-backend-btas.onrender.com/api/clients');
        setClient(clientResponse.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Check if projectData, client, and users are loaded
  if (!projectData || !client || !Array.isArray(users) || users.length === 0) {
    return <div>Loading...</div>;
  }

  // Ensure members array exists
  const projectMembers = Array.isArray(projectData.users)
    ? users.filter(user => projectData.users.includes(user._id))
    : []; // Fallback to an empty array if users is not defined or not an array

  return (
    <div className="mb-5">
      <div>
        <ul className="flex flex-wrap mt-3 border-b border-gray-300">
          <li>
            <button
              className={`p-3 py-2 -mb-[1px] block ${activeTab === 'summary' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
          </li>
          <li>
            <button
              className={`p-3 py-2 -mb-[1px] block ${activeTab === 'activity' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
          </li>
          <li>
            <button
              className={`p-3 py-2 -mb-[1px] block ${activeTab === 'tasks' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
            </button>
          </li>
          <li>
            <button
              className={`p-3 py-2 -mb-[1px] block ${activeTab === 'attachments' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('attachments')}
            >
              Attachments
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className="pt-5">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <h4 className="text-xl font-semibold mb-4">{projectData.projectCode}</h4>
              <div className="card border-t-4 border-blue-600 bg-white shadow-md p-4">
                <div className="card-header flex justify-between items-center">
                  <span className="badge mb-2 bg-blue-500 text-white px-20 py-3 rounded-full">
                    {projectData.status}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="card-body">
                  <label className="font-semibold  text-gray-800">Project Overview:</label>
                  <p className="text-gray-600 mb-2">{projectData.overview || 'N/A'}</p>
                  <hr />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="font-semibold text-gray-800">Project Progress:</label>
                      <div className="flex items-center">
                        <div className="relative w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                          <div
                            className="absolute inset-0 border-4 border-blue-600 rounded-full"
                            style={{
                              transform: `rotate(${(projectData.progress / 100) * 360}deg)`,
                            }}
                          ></div>
                          <span className="absolute text-xl font-bold text-blue-600">{projectData.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-800">Created On:</label>
                      <p>{new Date(projectData.createdAt).toLocaleDateString() || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-800">Last Updated:</label>
                      <p>{new Date(projectData.updatedAt).toLocaleDateString() || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Members */}
              <div className="grid mt-5 grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card border-t-4 border-blue-600 bg-white shadow-md p-4">
                  <div className="card-header">
                    <h4 className="text-lg text-gray-700">Project Members ({projectMembers.length})</h4>
                  </div>
                  <div className="card-body">
                    <ul>
                      {projectMembers.map((member) => (
                        <li key={member._id} className="flex items-center mb-4">
                          <img
                            src={`https://ui-avatars.com/api/?name=${member.name}&size=64&rounded=true&color=fff&background=random`}
                            alt={member.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <h6 className="font-semibold text-gray-700">{member.name}</h6>
                            <span className="text-gray-500">{member.email}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Client Info */}
                <div className="card border-t-4 border-blue-600 bg-white shadow-md p-4">
                  <div className="card-header">
                    <h4 className="text-lg text-gray-700">Client</h4>
                  </div>
                  <div className="card-body">
                    <ul>
                      <li className="flex items-center mb-4">
                        <img
                          src={`https://ui-avatars.com/api/?name=${client.name}&size=64&rounded=true&color=fff&background=random`}
                          alt={client.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h6 className="font-semibold text-gray-700">{client.name}</h6>
                          <span className="text-gray-500">{client.email}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Information */}
            <div className="grid grid-cols-1 gap-4">
              <div className="card bg-white shadow-md p-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-600 p-3 text-white">
                    <i className="fas fa-money-bill-alt"></i>
                  </div>
                  <div className="ml-4">
                    <label className="text-gray-700 font-semibold">Budget</label>
                    <p className="text-gray-900 text-xl">${projectData.budget || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="card bg-white shadow-md p-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-600 p-3 text-white">
                    <i className="fas fa-money-check-alt"></i>
                  </div>
                  <div className="ml-4">
                    <label className="text-gray-700 font-semibold">Budget Type</label>
                    <p className="text-gray-900">{projectData.budgetType || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="card bg-white shadow-md p-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-600 p-3 text-white">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="ml-4">
                    <label className="text-gray-700 font-semibold">Team Size</label>
                    <p className="text-gray-900">{projectMembers.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            <h4 className="text-lg font-semibold">Activity Log</h4>
            {/* Placeholder for activity log */}
            <p>No activity logged yet.</p>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div>
            <h4 className="text-lg font-semibold">Tasks</h4>
            {/* Placeholder for tasks */}
            <p>No tasks available.</p>
          </div>
        )}

        {activeTab === 'attachments' && (
          <div>
            <h4 className="text-lg font-semibold">Attachments</h4>
            {/* Placeholder for attachments */}
            <p>No attachments available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleTabs;
