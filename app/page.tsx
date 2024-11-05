// page.tsx
import React from 'react';
import Header from '../components/homeheader';
import './output.css';

function Page() {
  return (
    <div className="min-h-screen bg-c2 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-6xl font-bold mb-4 text-white">Study Sphere</h1> 
        <p className="text-xl text-white">Gamify your Learning</p> {/* Smaller font size */}
      </main>
    </div>
  );
}

export default Page;
