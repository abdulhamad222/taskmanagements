'use client';

import { usePathname } from 'next/navigation';
import TopRightProfile from './user/components/TopRightProfile';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideProfile = pathname === '/login' || pathname === '/register';

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white relative">
      {!hideProfile && <TopRightProfile />}
      {children}
    </main>
  );
}
