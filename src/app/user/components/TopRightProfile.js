'use client';

import { useAuth } from '@/app/user/components/AuthContext';
import { usePathname } from 'next/navigation';

export default function TopRightProfile() {
  const { user, isReady, signOut } = useAuth();
  const pathname = usePathname();

  // Do not show on login or register page
  if (pathname === '/login' || pathname === '/') return null;

  if (!isReady) return null;

  return (
    <div className="absolute top-4 right-4 text-sm text-white flex items-center gap-4">
      {user ? (
        <div className="text-right">
          <div className="font-bold">{user.name}</div>
          <button
            onClick={signOut}
            className="mt-1 px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="text-gray-400">Not logged in</div>
      )}
    </div>
  );
}
