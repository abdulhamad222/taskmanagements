'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  FolderKanban,
  Calendar,
  Users,
  Inbox,
  Bell,
  BarChart2,
  StickyNote,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAdminAuth } from './adminAuthContext';

const links = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'My Tasks', href: '/admin/dashboard/my-tasks', icon: ClipboardList },
  { name: 'Projects', href: '/admin/dashboard/projects', icon: FolderKanban },
  { name: 'Calendar', href: '/admin/dashboard/celender', icon: Calendar },
  { name: 'Team', href: '/admin/dashboard/team', icon: Users },
  { name: 'Inbox', href: '/admin/dashboard/inbox', icon: Inbox },
  { name: 'Notifications', href: '/admin/dashboard/notifications', icon: Bell },
  { name: 'Reports', href: '/admin/dashboard/reports', icon: BarChart2 },
  { name: 'Notes', href: '/admin/dashboard/notes', icon: StickyNote },
  { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAdminAuth();

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-[#1c1c1c] p-4 border-b border-[#333] text-white">
        <h2 className="text-lg font-bold">Admin Task Manager</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar: fixed on mobile + sticky on desktop */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-full md:h-screen w-64 bg-[#1c1c1c] text-white transform transition-transform duration-200 ease-in-out 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:flex flex-col p-4 border-r border-[#333] overflow-y-auto`}
      >
        <h2 className="text-xl font-bold mb-6 px-2 hidden md:block">Admin Task Manager</h2>

        <nav className="flex-1 space-y-2">
          {links.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                pathname === href
                  ? 'bg-[#704ac2] text-white'
                  : 'hover:bg-[#2a2a2a] text-gray-300'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{name}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-400 px-3 py-2 mt-4 hover:bg-[#2a2a2a] rounded-lg"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
