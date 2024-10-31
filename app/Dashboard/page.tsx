"use client";
import React from 'react';
import DeadlinesList from '@/components/deadlines';
import Leaderboard from '@/components/leaderboard';
import MyCalendar from '@/components/Calendar';
import DeadlineForm from '@/components/Deadlineform';
import Challengetable from '@/components/challenge';
import '../output.css';

// Define the type for deadline entries
interface Deadline {
  name: string;
  description: string;
  deadlineDate: string;
}

function Page() {
  const handleAddDeadline = (deadline: Deadline) => {
    console.log(deadline);
  };

  return (
    <div className="bg-c2 min-h-screen">
      <div className="grid grid-cols-12 gap-4 p-4 h-full">
        {/* DeadlinesList with 3 columns (25%) */}
        <div className="col-span-3 p-4 h-full">
          <DeadlinesList />
        </div>
        
        {/* Leaderboard with 3 columns (25%) */}
        <div className="col-span-3 p-4 h-full">
          <Leaderboard />
        </div>

        {/* NewComponent with 3 columns (25%) between Leaderboard and DeadlineForm */}
        <div className="col-span-3 p-4 h-full">
          <Challengetable />
        </div>
        
        {/* DeadlineForm with 3 columns (25%) */}
        <div className="col-span-3 p-4 h-full">
          <DeadlineForm onAddDeadline={handleAddDeadline} />
        </div>
        
        {/* Calendar spans the full width below the other components */}
        <div className="col-span-12 p-4 h-full">
          <MyCalendar />
        </div>
      </div>
    </div>
  );
}

export default Page;
