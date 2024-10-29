import React from 'react';

function dashheader() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex gap-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="/timetable" className="hover:underline">Time Table</a>
      </div>
      <div>
        <a href="/signout" className="hover:underline">Sign Out</a>
      </div>
    </header>
  );
}

export default dashheader;
