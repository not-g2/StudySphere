"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import DeadlinesList from "@/components/deadlines";
import MyCalendar from "@/components/Calendar";
import GoalTable from "@/components/goalview";
import Challengetable from "@/components/challenge";
import AddGoalForm from "@/components/addgoal";
import SubjectSchedulerModal from "@/components/timetable";
import AttendancePieChart from "@/components/AttendancePieChart";
import DeadlineForm from "@/components/Deadlineform";

// Dynamic imports
const Leaderboard = dynamic(() => import("@/components/leaderboard"), {
  ssr: false,
});
const LevelProgress = dynamic(() => import("@/components/XPchart"), {
  ssr: false,
});

interface Deadline {
  title: string;
  description: string;
  startdate: string;
  enddate: string;
}

interface Goal {
  name: string;
  endDate: string;
}

function Page() {
  const [session, setSession] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleAddGoal = (goal: Goal) => {
    console.log("Added goal:", goal);
  };

  const handleScheduleSubmit = (schedule: {
    subject: string;
    days: { [day: string]: { startTime: string; endTime: string } };
  }) => {
    console.log("New schedule submitted:", schedule);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const sessionData = Cookies.get("session");
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    } else {
      router.push("/auth/signin");
    }
  }, [router]);

  function addDeadline(deadline: Deadline): void {
    async function createReminder(deadlineData: Deadline) {
      try {
        const response = await fetch("http://localhost:8000/api/reminder/reminders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deadlineData),
        });

        if (!response.ok) {
          throw new Error("Error creating reminder");
        }

        const newReminder = await response.json();
        console.log("New reminder created:", newReminder);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    createReminder(deadline);
  }

  return (
    <div className="bg-c2">
      {/* Row 1: LevelProgress (left), Leaderboard (center), Deadlines (right) */}
      <div
        className="bg-c2"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 20px",
          alignItems: "center",
        }}
      >
        {/* LevelProgress */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start", marginRight: "10px" }}>
          <div style={{ width: "250px", height: "250px" }}>
            <LevelProgress level={5} xp={70} />
          </div>
        </div>
        {/* Leaderboard */}
        <div style={{ flex: 2, display: "flex", justifyContent: "center", margin: "0 10px" }}>
          <Leaderboard session={session} />
        </div>
        {/* DeadlinesList */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", marginLeft: "10px" }}>
          <DeadlinesList />
        </div>
      </div>

      {/* Row 2: Attendance graph centered */}
      <div
        className="bg-c2"
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0",
        }}
      >
        <AttendancePieChart />
      </div>

      {/* Row 3: AddGoalForm, DeadlineForm, GoalTable, Challengetable side by side */}
      <div
        className="bg-c2"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 20px",
          alignItems: "flex-start",
        }}
      >
        {/* Add New Goal (expanded) */}
        <div style={{ flex: 2, marginRight: "10px" }}>
          <AddGoalForm onAddGoal={handleAddGoal} />
        </div>
        {/* Add Reminder */}
        <div style={{ flex: 1, marginRight: "10px" }}>
          <DeadlineForm onAddDeadline={addDeadline} />
        </div>
        {/* Goals */}
        <div style={{ flex: 1, marginRight: "10px" }}>
          <GoalTable />
        </div>
        {/* Challenges */}
        <div style={{ flex: 1 }}>
          <Challengetable />
        </div>
      </div>

      {/* Row 4: Calendar / Scheduler */}
      <div style={{ marginTop: "20px", padding: "0 20px" }} className="bg-c2">
        {isModalOpen ? (
          <SubjectSchedulerModal
            onScheduleSubmit={handleScheduleSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        ) : (
          <MyCalendar />
        )}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <button onClick={() => setIsModalOpen(true)} className="bg-t2 text-white">
            Add Subject Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
