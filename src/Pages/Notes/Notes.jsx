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

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNotes = async () => {
        const token = localStorage.getItem("authToken");
        setLoading(true);
        try {
            const response = await axios.get(`${server}/notes/getNotesByClientId`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setNotes(response.data.notes);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Notes</h2>
            {loading ? (
                <p>Loading notes...</p>
            ) : (
                <NotesList notes={notes} />
            )}
        </div>
    );
};

export default Notes