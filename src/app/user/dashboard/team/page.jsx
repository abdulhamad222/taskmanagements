'use client';

import { useEffect, useState } from 'react';

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch registered users (team members)
  useEffect(() => {
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

    fetchTeam();
  }, []);

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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
