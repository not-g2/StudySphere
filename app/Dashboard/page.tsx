"use client";
import React from 'react';
import DeadlinesList from '@/components/deadlines';
import Leaderboard from '@/components/leaderboard'; // Import the Leaderboard component
import Calendar from '../../components/calender';
import '../output.css';

function Page() {
  return (
    <div >
      <div className="p-4 flex">
        {/* DeadlinesList with 28% width */}
        <div className="w-28/100 p-4">
          <DeadlinesList />
        </div>
        
        {/* Leaderboard with 28% width */}
        <div className="w-28/100 p-4">
          <Leaderboard />
        </div>
        
        {/* Calendar takes remaining width */}
        <div className="flex-grow p-4">
          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default Page;
