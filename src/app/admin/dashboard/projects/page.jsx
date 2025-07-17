'use client';

import { useEffect, useState } from 'react';
import Spinner from '@/app/user/components/spinner';
import { useAuth } from '@/app/user/components/AuthContext';

export default function ProjectsPage() {
  const { user, isReady } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState('');

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

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.trim() || !user) return;

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProject,
          description: '',
          userId: user.email, // ✅ Send userId for notification
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setProjects([data.project, ...projects]);
        setNewProject('');
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Add project error:', error);
    }
  };

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">📁 Projects</h1>

      <form
        onSubmit={handleAddProject}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        <input
          type="text"
          placeholder="Enter new project name"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          className="flex-1 rounded border px-4 py-2 text-black focus:ring-2 focus:ring-[#704ac2]"
        />
        <button
          type="submit"
          className="rounded bg-[#704ac2] px-4 py-2 font-semibold text-white hover:bg-[#5a3ca0]"
        >
          Add Project
        </button>
      </form>

      {loading ? (
        <Spinner />
      ) : projects.length === 0 ? (
        <p className="text-gray-500">No projects found. Start by adding one!</p>
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
