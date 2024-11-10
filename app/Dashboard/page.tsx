"use client";

import React, { useEffect, useState } from "react";
import DeadlinesList from "@/components/deadlines";
import MyCalendar from "@/components/Calendar";
import GoalTable from "@/components/goalview";
import Challengetable from "@/components/challenge";
import AddGoalForm from "@/components/addgoal";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import SubjectSchedulerModal from "@/components/timetable";
import "../output.css";

// Dynamically import components without SSR
const Leaderboard = dynamic(() => import("@/components/leaderboard"), { ssr: false });
const LevelProgress = dynamic(() => import("@/components/XPchart"), { ssr: false });

interface Deadline {
  name: string;
  description: string;
  deadlineDate: string;
}

interface Goal {
  name: string;
  endDate: string;
}

interface Challenge {
  name: string;
  description: string;
  endDate: string;
}

function Page() {
  const [session, setSession] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Handle adding a new goal
  const handleAddGoal = (goal: Goal) => {
    console.log("Added goal:", goal);
  };

  // Handle scheduling subject submission
  const handleScheduleSubmit = (schedule: { subject: string; days: { [day: string]: { startTime: string; endTime: string } } }) => {
    console.log("New schedule submitted:", schedule);
    setIsModalOpen(false);
  };

  // Retrieve session data
  useEffect(() => {
    const sessionData = Cookies.get("session");

    if (sessionData) {
      setSession(JSON.parse(sessionData));
    } else {
      router.push("/auth/signin");
    }
  }, [router]);

  return (
    <div className="bg-c2 min-h-screen flex flex-col items-center justify-center">
      <div className="grid grid-cols-12 gap-4 p-4 w-full">
        
        {/* Level Progress */}
        <div className="col-span-6 col-start-4 p-4 flex flex-col items-center">
          <div style={{ width: "250px", height: "250px" }} className="mb-8">
            <LevelProgress level={5} xp={70} />
          </div>
        </div>

        {/* Sidebar: Deadlines and Leaderboard */}
        <div className="col-span-3 p-4 h-full">
          <DeadlinesList />
        </div>
        <div className="col-span-3 p-4 h-full">
          <Leaderboard session={session} />
        </div>

        {/* Main Content: Add Goal and Goals Table */}
        <div className="col-span-6 p-4 h-full bg-c2 rounded-lg shadow-md">
          <AddGoalForm onAddGoal={handleAddGoal} />

          <div className="mt-6">
            <GoalTable /> {/* Display goals in the GoalTable */}
          </div>
        </div>

        {/* Full-Width Calendar or Scheduler */}
        <div className="col-span-12 p-4 h-full bg-c2 rounded-lg shadow-md">
          {isModalOpen ? (
            <SubjectSchedulerModal
              studentId={session?.user?.id}  // Assuming session contains user.id
              onScheduleSubmit={handleScheduleSubmit}
              onClose={() => setIsModalOpen(false)}
            />
          ) : (
            <MyCalendar />
          )}
        </div>

        {/* Button to Open Scheduler Modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-t2 text-white p-2 rounded mb-4 hover:bg-opacity-80 transition"
        >
          Add Subject Schedule
        </button>
      </div>
    </div>
  );
}

export default Page;
