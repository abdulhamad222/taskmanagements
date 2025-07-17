'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function fetchAdminProfile() {
      try {
        const res = await fetch('/api/admin-profile', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch admin profile:', err);
      } finally {
        setIsReady(true);
      }
    }

    fetchAdminProfile();
  }, []);

  const signOut = async () => {
    try {
      await fetch('/api/admin-logout', { method: 'POST' });
    } catch (err) {
      console.error('Admin logout failed:', err);
    } finally {
      setUser(null);
      window.location.href = '/admin';
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, isReady, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
