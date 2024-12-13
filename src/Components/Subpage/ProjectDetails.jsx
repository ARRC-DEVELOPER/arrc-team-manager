import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from "../../main.jsx";
import { useParams } from 'react-router-dom';
import { message } from "antd";

const AddNote = ({ projectId, fetchNotes }) => {
  const [noteText, setNoteText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = React.useRef();

  const handleAddNote = async () => {
    const token = localStorage.getItem("authToken");

    if (!noteText.trim()) return alert("Note text cannot be empty");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", noteText);
      if (file) formData.append("file", file);

      await axios.post(`${server}/notes/addNote/${projectId}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      message.success("Note added successfully");

      setNoteText("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchNotes();
    } catch (error) {
      console.error("Error adding note:", error);
      message.error(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-md mb-4">
      <textarea
        className="w-full p-2 border rounded-md"
        placeholder="Write your note here..."
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        rows={3}
      ></textarea>

      <input
        type="file"
        className="block mt-2"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={handleAddNote}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Note"}
      </button>
    </div>
  );
};

const NotesList = ({ notes }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      {notes.length > 0 ? (
        notes.map((note) => (
          <div key={note._id} className="p-2 mb-2 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{note.text}</h3>
              {note.file && (
                <a
                  href={`${note.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View File
                </a>
              )}
              <p className="text-sm text-gray-500">Created by: {note.createdBy.name}</p>
            </div>
            <p className="text-sm text-gray-500">{new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }).format(new Date(note.createdAt))}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No notes available.</p>
      )}
    </div>
  );
};

const PaginationControls = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <div className="flex justify-center mt-4">
      <button
        className="px-4 py-2 border rounded-l-md"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="px-4 py-2 border">{`Page ${currentPage} of ${totalPages}`}</span>
      <button
        className="px-4 py-2 border rounded-r-md"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

const ProjectDetails = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [projectData, setProjectData] = useState(null);
  const [users, setUsers] = useState([]);
  const [client, setClient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });
  const [taskPagination, setTaskPagination] = useState({ totalPages: 1, currentPage: 1 });
  const { projectId } = useParams();

  console.log(tasks);

  const fetchNotes = async (projectId = null, page = 1) => {
    const token = localStorage.getItem("authToken");
    setLoading(true);
    try {
      const endpoint = projectId
        ? `${server}/notes/getNotesByProject/${projectId}?page=${page}&limit=5`
        : `${server}/notes/getNotesByClientId?page=${page}&limit=5`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { notes, totalPages, currentPage } = response.data;

      setNotes(notes);
      setPagination({ totalPages, currentPage });
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (projectId = null, page = 1) => {
    setLoading(true);
    try {
      const endpoint = `${server}/tasks/project/${projectId}`

      const response = await axios.get(endpoint);
      console.log(response);

      const tasks = response.data;

      setTasks(tasks);
      // setTaskPagination({ totalPages, currentPage });
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project data from API
        const projectResponse = await axios.get(`${server}/projects`);
        setProjectData(projectResponse.data[0]); // Assuming first project

        // Fetch users (members) from API
        const usersResponse = await axios.get(`${server}/users`);
        setUsers(usersResponse.data); // Set all users

        setClient(usersResponse.data[4]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchNotes(projectId);
    fetchTasks(projectId);
  }, []);

  // Check if projectData, client, and users are loaded
  if (!projectData || !client || !Array.isArray(users) || users.length === 0) {
    return <div>Loading...</div>;
  }

  // Ensure members array exists
  const projectMembers = Array.isArray(projectData.users)
    ? users.filter(user => projectData.users.includes(user._id))
    : []; 

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
            <AddNote projectId={projectId} />
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            <NotesList notes={notes} />
            <PaginationControls
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              onPageChange={(page) => fetchNotes(projectId, page)}
            />
          </div>
        )}

        {activeTab === 'tasks' && (
          <div>
            <div className="bg-white p-4 shadow-md rounded-md">
              {tasks.length > 0 ? (
                tasks.map((note) => (
                  <div key={note._id} className="p-2 mb-2 border-b flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{note.title}</h3>
                      
                      {/* <p className="text-sm text-gray-500">Created by: {note.createdBy.name}</p> */}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No tasks available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
