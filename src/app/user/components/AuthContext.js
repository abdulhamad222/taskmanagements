'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();

  const isPublicPage = pathname === '/login' || pathname === '/';

  useEffect(() => {
    if (isPublicPage) {
      setIsReady(true); // Skip auth check for public pages
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile', { cache: 'no-store' });

        if (res.status === 401) {
          setUser(null);
        } else {
          const data = await res.json();
          if (data.success) {
            setUser({ name: data.user.name });
          }
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setUser(null);
      } finally {
        setIsReady(true);
      }
    }

    fetchProfile();
  }, [isPublicPage]);

  const signIn = (userData) => {
    setUser({ name: userData.name });
  };

  const signOut = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
