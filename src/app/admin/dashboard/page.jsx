'use client';

import { useAdminAuth } from '../components/adminAuthContext';
import Spinner from '@/app/user/components/spinner';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user, isReady } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) {
      router.push('/admin');
    }
  }, [isReady, user, router]);

  if (!isReady) {
    return (
      <main className="h-screen flex items-center justify-center bg-[#0e0e0e] text-white">
        <Spinner />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white">
      <div className="text-center space-y-4 p-6 bg-[#1c1c1c] rounded-xl shadow">
        <h1 className="text-3xl font-bold">Welcome Admin</h1>
        <p>This is the admin dashboard.</p>
      </div>
    </main>
  );
}
