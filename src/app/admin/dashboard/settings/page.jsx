'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../components/adminAuthContext'; 
import Spinner from '@/app/user/components/spinner'; 
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const { user, isReady } = useAdminAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isReady && user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [isReady, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return toast.error('All fields are required');
    if (form.password && form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        name: form.name,
        password: form.password,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok && data.success) {
      toast.success('Settings updated');
    } else {
      toast.error(data.error || 'Update failed');
    }
  };

  if (!isReady || !user) return <Spinner />;

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ Admin Settings</h1>

      <div className="max-w-xl space-y-6">
        <div>
          <label className="block mb-2 font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">New Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </main>
  );
}
