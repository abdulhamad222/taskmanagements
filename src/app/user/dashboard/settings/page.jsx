'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/user/components/AuthContext';
import Spinner from '@/app/user/components/spinner';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, isReady, signOut } = useAuth();
  const [form, setForm] = useState({ name: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isReady && user) {
      setForm((prev) => ({ ...prev, name: user.name || '' }));
    }
  }, [isReady, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    if (form.password && form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        name: form.name,
        password: form.password,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success('Settings updated');
    } else {
      toast.error(data.error || 'Failed to update');
    }
  };

  if (!isReady || !user) return <Spinner />;

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ Settings</h1>

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
          <label className="block mb-2 font-medium">Email (read-only)</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="w-full rounded px-4 py-2 bg-gray-700 text-white"
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
          className="rounded bg-[#704ac2] px-6 py-2 font-semibold text-white hover:bg-[#5a3ca0]"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </main>
  );
}