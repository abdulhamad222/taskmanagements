'use client';

import { useEffect, useState } from 'react';
import Spinner from '@/app/user/components/spinner';
import { useAuth } from '@/app/user/components/AuthContext';

export default function ProjectsPage() {
  const { user, isReady } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady) {
      fetchProjects();
    }
  }, [isReady]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">📁 Projects</h1>

      {loading ? (
        <Spinner />
      ) : projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="rounded-xl bg-[#282828] p-4 shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold mb-2">{project.title}</h2>
              <p className="text-sm text-gray-400">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
