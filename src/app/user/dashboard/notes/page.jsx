'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/user/components/AuthContext';
import Spinner from '@/app/user/components/spinner';

export default function NotesPage() {
  const { user, isReady } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">📝 Notes</h1>

      {loading ? (
        <Spinner />
      ) : notes.length === 0 ? (
        <p className="text-gray-500">No notes yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-[#282828] p-4 rounded-xl shadow hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-2">{note.title}</h2>
              <p className="text-sm text-gray-300">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
