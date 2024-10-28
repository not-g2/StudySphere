"use client";

import React from 'react';
import { signIn } from 'next-auth/react';
import '../app/output.css';

function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-c1 text-c1">
      <div className="flex-grow"></div>
      <div className="flex space-x-4">
        <button 
          className="px-4 py-2 bg-c4 rounded hover:bg-c3"
          onClick={() => signIn()} // Add signIn functionality here
        >
          Sign In
        </button>
        <button className="px-4 py-2 bg-c4 rounded hover:bg-c3">
          Sign Up
        </button>
      </div>
    </header>
  );
}

export default Header;
