'use client';

import { useAuth } from '@/app/user/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ children }) {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) {
      router.push('/login');
    }
  }, [isReady, user]);

  if (!isReady || !user) return null;

  return (
    <div className="flex min-h-screen bg-[#0e0e0e] text-white">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
