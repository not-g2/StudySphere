"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import useSessionCheck from "../../hooks/auth";

import DeadlinesList from "@/components/deadlines";
import AttendancePieChart from "@/components/AttendancePieChart";

// Dynamic imports
const Leaderboard = dynamic(() => import("@/components/leaderboard"), {
  ssr: false,
});
const LevelProgress = dynamic(() => import("@/components/XPchart"), {
  ssr: false,
});

function Page() {
  const [session, setSession] = useState(null);
  
  // Use the custom hook for session checking
  useSessionCheck(setSession);

  return (
    <div className="bg-c2 min-h-screen">
      {/* Top Row: LevelProgress, Leaderboard, DeadlinesList */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* LevelProgress */}
          <div className="flex-1 flex justify-start mr-2">
            <div className="w-64 h-64">
              <LevelProgress level={5} xp={70} />
            </div>
          </div>
          {/* Leaderboard */}
          <div className="flex-1 flex justify-center mx-2">
            <Leaderboard session={session} />
          </div>
          {/* DeadlinesList */}
          <div className="flex-1 flex justify-end ml-2">
            <DeadlinesList />
          </div>
        </div>
      </div>

      {/* Bottom Row: AttendancePieChart spanning full width */}
      <div className="w-full bg-c2">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center">
            <AttendancePieChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
