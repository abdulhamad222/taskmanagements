'use client';

import { AdminAuthProvider } from "../components/adminAuthContext";
import AdminSidebarWrapper from "../components/adminSidebarWrapper";


export default function AdminDashboardLayout({ children }) {
  return (
    <AdminAuthProvider>
      <div className="flex min-h-screen bg-[#0e0e0e] text-white">
        <AdminSidebarWrapper />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AdminAuthProvider>
  );
}
