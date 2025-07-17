'use client';

import { useEffect, useState } from 'react';
import Spinner from '@/app/user/components/spinner';
import { useAuth } from '@/app/user/components/AuthContext';

export default function ReportsPage() {
  const { user, isReady } = useAuth();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady && user) {
      fetchReports();
    }
  }, [isReady, user]);

  const fetchReports = async () => {
    try {
      const [taskRes, projectRes] = await Promise.all([
        fetch('/api/my-tasks'),
        fetch('/api/projects')
      ]);

      const taskData = await taskRes.json();
      const projectData = await projectRes.json();

      const completed = taskData.tasks.filter(task => task.status === 'Completed');

      setCompletedTasks(completed);
      setProjects(projectData.projects);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">📊 Reports</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#282828] p-4 rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold">Total Projects</h2>
          <p className="text-2xl mt-2">{projects.length}</p>
        </div>
        <div className="bg-[#282828] p-4 rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold">Completed Tasks</h2>
          <p className="text-2xl mt-2">{completedTasks.length}</p>
        </div>
        <div className="bg-[#282828] p-4 rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold">Total Items</h2>
          <p className="text-2xl mt-2">{projects.length + completedTasks.length}</p>
        </div>
      </div>

      {/* Completed Tasks */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">✅ Completed Tasks</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {completedTasks.map(task => (
            <div key={task._id} className="bg-[#282828] p-4 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section>
        <h2 className="text-xl font-bold mb-4">📁 Projects</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <div key={project._id} className="bg-[#282828] p-4 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-gray-400">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
