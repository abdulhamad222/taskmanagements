'use client';

import Spinner from '@/app/user/components/spinner';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/user/components/AuthContext';

export default function MyTasksPage() {
  const { user, isReady } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    if (isReady) {
      fetchTasks();
    }
  }, [isReady]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/my-tasks');
      const data = await res.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !user) return;

    try {
      const res = await fetch('/api/my-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask,
          status,
          userId: user.email, // ✅ Include userId for task + notification
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setTasks([data.task, ...tasks]);
        setNewTask('');
        setStatus('Pending');
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Add task error:', error);
    }
  };

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">🗂️ My Tasks</h1>

      <form
        onSubmit={handleAddTask}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        <input
          type="text"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 rounded border px-4 py-2 text-black focus:ring-2 focus:ring-[#704ac2]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded border px-4 py-2 text-black"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <button
          type="submit"
          className="rounded bg-[#704ac2] px-4 py-2 font-semibold text-white hover:bg-[#5a3ca0]"
        >
          Add Task
        </button>
      </form>

      {loading ? (
        <Spinner />
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">You have no tasks yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="rounded-xl bg-[#282828] p-4 shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{task.title}</h2>
              <p
                className={`mt-2 text-sm font-medium ${
                  task.status === 'Completed'
                    ? 'text-green-400'
                    : task.status === 'In Progress'
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
              >
                {task.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
