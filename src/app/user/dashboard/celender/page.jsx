'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarPage() {
  const [value, setValue] = useState(new Date());

  return (
    <main className="min-h-screen bg-[#0e0e0e] p-4 sm:p-6 md:p-10 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">📅 Calendar</h1>

      <div className="flex justify-center">
        <div className="w-full max-w-md text-gray-500 bg-[#282828] p-4 rounded-xl shadow">
          <Calendar
            onChange={setValue}
            value={value}
            className="rounded-lg w-full calendar-dark"
            tileClassName="text-black"
          />
          <p className="text-center mt-4 text-gray-300">
            Selected Date: <span className="font-semibold">{value.toDateString()}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
