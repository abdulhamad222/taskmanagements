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
import { useAuth } from '@/app/user/components/AuthContext';

const links = [
  { name: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
  { name: 'My Tasks', href: '/user/dashboard/my-tasks', icon: ClipboardList },
  { name: 'Projects', href: '/user/dashboard/projects', icon: FolderKanban },
  { name: 'Calendar', href: '/user/dashboard/celender', icon: Calendar },
  { name: 'Team', href: '/user/dashboard/team', icon: Users },
  { name: 'Inbox', href: '/user/dashboard/inbox', icon: Inbox },
  { name: 'Notifications', href: '/user/dashboard/notifications', icon: Bell },
  { name: 'Reports', href: '/user/dashboard/reports', icon: BarChart2 },
  { name: 'Notes', href: '/user/dashboard/notes', icon: StickyNote },
  { name: 'Settings', href: '/user/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut(); // Clear user context & localStorage
    router.push('/'); // Redirect to homepage or login
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      <div className="md:hidden flex items-center justify-between bg-[#1c1c1c] p-4 border-b border-[#333] text-white">
        <h2 className="text-lg font-bold">Task Manager</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar for desktop + conditional mobile menu */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#1c1c1c] text-white z-50 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:flex flex-col p-4 border-r border-[#333]`}
      >
        <h2 className="text-xl font-bold mb-6 px-2 hidden md:block">Task Manager</h2>

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

      {/* Overlay on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
