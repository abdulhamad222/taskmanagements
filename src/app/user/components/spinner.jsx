import React from 'react';

export default function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center w-full h-full min-h-screen ${className}`}>
      <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 animate-spin rounded-full border-4 border-[#704ac2] border-t-transparent" />
    </div>
  );
}
