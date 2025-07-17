'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from './components/adminAuthContext';
import TopRightAdminProfile from './components/TopRightAdminProfile';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminAuthGate>
        <main className="min-h-screen bg-[#0e0e0e] text-white relative">
          <TopRightAdminProfile />
          {children}
        </main>
        <Toaster position="top-center" reverseOrder={false} />
      </AdminAuthGate>
    </AdminAuthProvider>
  );
}

function AdminAuthGate({ children }) {
  const { user, isReady } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) {
      router.push('/admin');
    }
  }, [isReady, user, router]);

  if (!isReady) return null;
  return children;
}
