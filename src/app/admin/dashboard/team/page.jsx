'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      if (res.ok) {
        setTeam(data.users);
      } else {
        console.error('Error loading team:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch team:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to remove this member?')) return;

  try {
    setDeletingId(id);
    const res = await fetch(`/api/team/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('✅ Member removed successfully!', {
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        },
      });
      setTeam((prev) => prev.filter((user) => user._id !== id));
    } else {
      toast.error(data.error || '❌ Failed to remove member', {
        duration: 4000,
        style: {
          background: '#440000',
          color: '#fff',
        },
      });
    }
  } catch (error) {
    toast.error('🚫 Error removing member', {
      duration: 4000,
    });
    console.error(error);
  } finally {
    setDeletingId(null);
  }
};


  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">👥 Team Members</h1>

      {loading ? (
        <p className="text-gray-400">Loading team members…</p>
      ) : team.length === 0 ? (
        <p className="text-gray-500">No team members found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div
              key={member._id}
              className="rounded-xl bg-[#282828] p-4 shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{member.name}</h2>
              <p className="mt-1 text-sm text-gray-400">{member.email}</p>
              <button
                onClick={() => handleDelete(member._id)}
                disabled={deletingId === member._id}
                className="mt-3 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition disabled:opacity-50"
              >
                {deletingId === member._id ? 'Removing...' : 'Kick Out'}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
