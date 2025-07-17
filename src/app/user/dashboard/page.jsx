'use client';

import { useAuth } from '@/app/user/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Spinner from '../components/spinner';

export default function DashboardPage() {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) {
      router.push('/');
    }
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return (
      <main className="flex items-center justify-center h-screen bg-[#0e0e0e] text-white px-4">
        <Spinner />
        <p className="mt-2 text-sm">Checking authentication…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Welcome, {user.name} 👋</h1>
        <p className="text-sm text-gray-400">This is your user dashboard.</p>
      </div>
    </main>
  );
}
