import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://notes-backend-xyz.onrender.com"; // Replace with your actual backend URL

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/notes`, { 
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setNotes(res.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Session expired or invalid token. Please log in again.");
        navigate("/login");
      } else {
        alert("Error: " + (error.response?.data?.message || "Something went wrong"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(); 
  }, []);

  // Add new note function
  const addNote = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/auth/notes`, 
        { title, content }, 
        { withCredentials: true, 
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Failed to add note"));
    }
  };

  // Delete note function
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/auth/notes/${id}`, { 
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchNotes();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Failed to delete note"));
    }
  };

  return (
    <div className="p-5 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-semibold mb-5 text-center">My Notes</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <form onSubmit={addNote} className="mb-5 flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="p-3 border border-gray-300 rounded-md w-full sm:w-1/2"
            />
            <input 
              type="text" 
              placeholder="Content" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              className="p-3 border border-gray-300 rounded-md w-full sm:w-1/2"
            />
            <button 
              type="submit" 
              className="bg-green-500 text-white px-6 py-3 rounded-md mt-4 sm:mt-0 sm:ml-4 hover:bg-green-600 transition duration-300"
            >
              Add Note
            </button>
          </form>

          {notes.length === 0 ? (
            <p className="text-center">No notes available. Add a new note!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <div key={note._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-semibold">{note.title}</h3>
                  <p className="text-gray-700 mt-2">{note.content}</p>
                  <button 
                    onClick={() => deleteNote(note._id)} 
                    className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 w-full hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notes;
