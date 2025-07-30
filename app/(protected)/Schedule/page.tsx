"use client";

import React, { useState } from "react";
import MyCalendar from "../../../components/Calendar";
import DeadlineForm from "@/components/Deadlineform";
import SubjectSchedulerModal from "@/components/timetable";
import useSessionCheck from "../../hooks/auth";

const TimeTablePage: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminderRefresh, setReminderRefresh] = useState<number>(0);

  useSessionCheck(setSession);

  // bump the calendar when a new reminder is added
  const handleAddReminder = (deadline: any) => {
    console.log("Reminder added", deadline);
    setReminderRefresh((n) => n + 1);
  };

  const handleScheduleSubmit = (schedule: {
    subject: string;
    days: { [day: string]: { startTime: string; endTime: string } };
  }) => {
    console.log("New timetable schedule submitted:", schedule);
    setIsModalOpen(false);
  };

  return (
    <div
      className="min-h-screen pt-8 px-4 pb-4"
      style={{ backgroundColor: "#F3F3F4" }}
    >
      <div className="flex flex-row gap-4 items-start">
        {/* Left column: DeadlineForm, aligned to top */}
        <div className="w-1/3">
          <DeadlineForm onAddDeadline={handleAddReminder} />
        </div>

        {/* Right column: Calendar */}
        <div className="w-2/3">
          <MyCalendar refreshTrigger={reminderRefresh} />
        </div>
      </div>

      {isModalOpen && (
        <SubjectSchedulerModal
          onScheduleSubmit={handleScheduleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TimeTablePage;
