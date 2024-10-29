"use client";

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import '../app/output.css';

function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between p-4 bg-c1 text-c1">
      <div className="flex-grow"></div>
      <div className="flex space-x-4">
        {!session ? (
          <div>
            <button 
              className="px-4 py-2 bg-c4 rounded hover:bg-c3"
              onClick={() => signIn()} // Sign In functionality
            >
              Sign In
            </button>
            <button className="px-4 py-2 bg-c4 rounded hover:bg-c3">
              Sign Up
            </button>
          </div>
        ) : (
          <div>
            <img src={session.user?.image}></img>
            <button 
              className="px-4 py-2 bg-c4 rounded hover:bg-c3"
              onClick={() => signOut()} // Sign Out functionality
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
