'use client';

import { useAuth } from '@/app/user/components/AuthContext';
import Sidebar from './Sidebar';

export default function SidebarWrapper() {
  const { user, isReady } = useAuth();

  if (!isReady || !user) return null;

  return <Sidebar />;
}
