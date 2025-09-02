'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/user/components/AuthContext';
import Spinner from '@/app/user/components/spinner';

export default function InboxPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/members');
      const data = await res.json();
      setUsers(data.users.filter(u => u.email !== user.email));
      setLoading(false);
    }
    if (user) fetchUsers();
  }, [user]);

  useEffect(() => {
    async function fetchMessages() {
      if (!selectedUser || !user) return;
      const res = await fetch(`/api/message?with=${selectedUser._id}`, {
        headers: {
          userid: user.email, // ✅ send current user's ID
        },
      });
      const data = await res.json();
      setMessages(data.messages);
    }
    fetchMessages();
  }, [selectedUser, user]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !selectedUser) return;

    const res = await fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        userid: user.email, // ✅ include sender ID
      },
      body: JSON.stringify({
        to: selectedUser._id,
        message: newMessage,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setMessages([...messages, data.message]);
      setNewMessage('');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-[#0e0e0e] text-white">
      <aside className="sm:w-1/3 md:w-1/4 bg-[#1e1e1e] p-4 border-r border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Users</h2>
        <ul className="space-y-2 overflow-y-auto h-[80vh]">
          {users.map((u) => (
            <li
              key={u._id}
              className={`p-2 rounded cursor-pointer hover:bg-[#2e2e2e] ${
                selectedUser?._id === u._id ? 'bg-[#3b3b3b]' : ''
              }`}
              onClick={() => setSelectedUser(u)}
            >
              <div className="font-medium">{u.name}</div>
              <div className="text-xs text-gray-400">{u.email}</div>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-4 flex flex-col justify-between">
        {selectedUser ? (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-bold">Chat with {selectedUser.name}</h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-2 rounded max-w-xs ${
                    msg.sender === user.email ? 'bg-[#704ac2] self-end' : 'bg-[#333]'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 rounded px-4 py-2 text-black"
              />
              <button
                onClick={handleSend}
                className="bg-[#704ac2] hover:bg-[#5a3ca0] px-4 py-2 rounded text-white"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center mt-20">Select a user to start chatting</p>
        )}
      </main>
    </div>
  );
}
