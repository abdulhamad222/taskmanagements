'use client';

import { useAdminAuth } from './adminAuthContext';

export default function TopRightAdminProfile() {
  const { user, isReady, signOut } = useAdminAuth();

  if (!isReady || !user) return null;

  return (
    <div className="absolute top-4 right-4 text-sm text-white flex items-center gap-4">
      <div className="text-right bg-[#1f1f1f] px-4 py-2 rounded-lg shadow-lg">
        <div className="font-semibold text-white">{user.name || 'Admin'}</div>
        <div className="text-xs text-gray-400">{user.email}</div>
        <button
          onClick={signOut}
          className="mt-2 w-full px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
