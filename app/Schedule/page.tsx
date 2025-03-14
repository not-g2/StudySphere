"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import MyCalendar from "@/components/Calendar";
import SubjectSchedulerModal from "@/components/timetable";

const TimeTablePage: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Retrieve session from cookies and redirect if not found
  useEffect(() => {
    const sessionData = Cookies.get("session");
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    } else {
      router.push("/auth/signin");
    }
  }, [router]);

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
