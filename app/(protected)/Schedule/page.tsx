"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MyCalendar from "../../../components/Calendar";
import DeadlineForm from "@/components/Deadlineform";
import SubjectSchedulerModal from "@/components/timetable";
import useSessionCheck from "../../hooks/auth";
import dynamic from "next/dynamic";

const TimeTablePage: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useSessionCheck(setSession);

    // Handler for when a new schedule is submitted via the modal.
    const handleScheduleSubmit = (schedule: {
        subject: string;
        days: { [day: string]: { startTime: string; endTime: string } };
    }) => {
        console.log("New timetable schedule submitted:", schedule);
        setIsModalOpen(false);
    };

    return (
        <div
            className="min-h-screen p-4"
            style={{ backgroundColor: "#F3F3F4" }}
        >
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Time Table
            </h1>
            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                >
                    Add / Update Schedule
                </button>
            </div>
            {/* Flex container with a row layout so the DeadlineForm is on the left and Calendar is on the right */}
            <div className="flex flex-row gap-4">
                {/* Left Column: DeadlineForm */}
                <div className="w-1/3">
                    <DeadlineForm
                        onAddDeadline={(deadline) =>
                            console.log("Deadline added", deadline)
                        }
                    />
                </div>
                {/* Right Column: Calendar */}
                <div className="w-2/3">
                    <MyCalendar />
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

export default dynamic(() => Promise.resolve(TimeTablePage), { ssr: false });
