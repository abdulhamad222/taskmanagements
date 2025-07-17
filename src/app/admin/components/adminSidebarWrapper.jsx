'use client';

import { useAdminAuth } from './adminAuthContext';
import AdminSidebar from './adminSidebar';

export default function AdminSidebarWrapper() {
  const { user, isReady } = useAdminAuth();

  if (!isReady || !user) return null;

  return <AdminSidebar />;
}
