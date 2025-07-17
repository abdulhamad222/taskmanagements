'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/user/components/AuthContext';
import { Bell, FileText, Folder, MessageCircle } from 'lucide-react';
import Spinner from '@/app/user/components/spinner';

export default function NotificationPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !user) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?userId=${user.email}`);
        const data = await res.json();

        if (res.ok) {
          setNotifications(data);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, isReady]);

  const handleClick = (type) => {
    if (type === 'task') router.push('/dashboard/my-tasks');
    if (type === 'project') router.push('/dashboard/projects');
    if (type === 'inbox') router.push('/dashboard/inbox');
  };

  const getIcon = (type) => {
    if (type === 'task') return <FileText className="text-blue-500" />;
    if (type === 'project') return <Folder className="text-green-500" />;
    if (type === 'inbox') return <MessageCircle className="text-purple-500" />;
  };

  if (loading) return <Spinner />;

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell className="text-yellow-500" /> Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((note) => (
            <div
              key={note._id}
              onClick={() => handleClick(note.type)}
              className="bg-[#282828] p-4 rounded-2xl shadow-md flex items-start gap-4 hover:bg-[#333] transition cursor-pointer"
            >
              <div className="mt-1">{getIcon(note.type)}</div>
              <div>
                <p className="font-medium">{note.message}</p>
                <p className="text-sm text-gray-400">
                  {new Date(note.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
