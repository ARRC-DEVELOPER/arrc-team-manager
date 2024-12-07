import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";

const NotesList = ({ notes }) => {
    return (
        <div className="bg-white p-4 shadow-md rounded-md">
            {notes.length > 0 ? (
                notes.map((note) => (
                    <div key={note._id} className="p-2 mb-2 border-b flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">{note.text}</h3>
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

const Notes = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });

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

    const fetchProjects = async () => {
        setLoadingProjects(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get(`${server}/projectsByUser`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            setProjects(Array.isArray(response.data.projects) ? response.data.projects : []);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoadingProjects(false);
        }
    };

    const handleProjectChange = (projectId) => {
        setSelectedProject(projectId);
        fetchNotes(projectId);
    };

    useEffect(() => {
        fetchProjects();
        fetchNotes();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Notes</h2>

            {/* Project Dropdown */}
            {loadingProjects ? (
                <p>Loading projects...</p>
            ) : (
                <div className="mb-4">
                    <label className="block mb-2 text-gray-600">Select Project:</label>
                    <select
                        className="w-full p-2 border rounded-md"
                        value={selectedProject || ""}
                        onChange={(e) => handleProjectChange(e.target.value)}
                    >
                        <option value="">All Projects</option>
                        {projects.map((project) => (
                            <option key={project._id} value={project._id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {loading ? (
                <p>Loading notes...</p>
            ) : (
                <>
                    <NotesList notes={notes} />
                    <PaginationControls
                        totalPages={pagination.totalPages}
                        currentPage={pagination.currentPage}
                        onPageChange={(page) => fetchNotes(selectedProject, page)}
                    />
                </>
            )}
        </div>
    );
};

export default Notes