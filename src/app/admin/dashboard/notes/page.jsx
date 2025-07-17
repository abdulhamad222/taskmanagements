'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/user/components/AuthContext';
import Spinner from '@/app/user/components/spinner';

export default function NotesPage() {
  const { user, isReady } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    if (!isReady || !user) return;
    fetchNotes();
  }, [isReady, user]);

  const fetchNotes = async () => {
    const res = await fetch(`/api/notes?userId=${user.email}`);
    const data = await res.json();
    setNotes(data.notes);
    setLoading(false);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, content: newContent, userId: user.email }),
    });
    const data = await res.json();
    if (res.ok) {
      setNotes([data.note, ...notes]);
      setNewTitle('');
      setNewContent('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    setNotes(notes.filter((n) => n._id !== id));
  };

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">📝 Notes</h1>
      <form
        onSubmit={handleAddNote}
        className="mb-6 flex flex-col gap-4 md:flex-row"
      >
        <input
          type="text"
          placeholder="Note title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 px-4 py-2 rounded text-black"
        />
        <textarea
          placeholder="Note content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="flex-1 px-4 py-2 rounded text-black"
        ></textarea>
        <button className="bg-[#704ac2] px-4 py-2 rounded text-white">Add Note</button>
      </form>

      {loading ? (
        <Spinner />
      ) : notes.length === 0 ? (
        <p className="text-gray-500">No notes yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-[#282828] p-4 rounded-xl shadow hover:shadow-lg relative"
            >
              <h2 className="text-lg font-semibold mb-2">{note.title}</h2>
              <p className="text-sm text-gray-300">{note.content}</p>
              <button
                onClick={() => handleDelete(note._id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
