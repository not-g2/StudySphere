"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MyCalendar from "@/components/Calendar";
import SubjectSchedulerModal from "@/components/timetable";
import useSessionCheck from "../../hooks/auth"; // ✅ Added session hook

const TimeTablePage: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useSessionCheck(setSession); // ✅ Use session check hook

  // Handler for when a new schedule is submitted via the modal
  const handleScheduleSubmit = (schedule: {
    subject: string;
    days: { [day: string]: { startTime: string; endTime: string } };
  }) => {
    console.log("New timetable schedule submitted:", schedule);
    // Here you might call an API to persist the schedule changes.
    setIsModalOpen(false);
  };

  return (
    <div className="bg-c2 p-4 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-white mb-6">
        Time Table
      </h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-t2 text-white px-4 py-2 rounded"
        >
          Add / Update Schedule
        </button>
      </div>

      {/* Display the scheduler modal when open; otherwise show the calendar */}
      {isModalOpen ? (
        <SubjectSchedulerModal
          onScheduleSubmit={handleScheduleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      ) : (
        <MyCalendar />
      )}
    </div>
  );
};

export default TimeTablePage;
