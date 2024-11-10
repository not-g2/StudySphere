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
import AttendancePieChart from "@/components/AttendancePieChart";
import "../output.css";
import DeadlineForm from "@/components/Deadlineform";

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

interface Challenge {
    name: string;
    description: string;
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
        async function createReminder(deadline: any) {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/reminder/reminders",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(deadline),
                    }
                );

                if (!response.ok) {
                    throw new Error("Error creating reminder");
                }

                const newReminder = await response.json();
                console.log("New reminder created:", newReminder);
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }

    return (
        <div className="bg-c2 min-h-screen flex flex-col items-center p-4">
            <div className="grid grid-cols-12 gap-6 w-full max-w-7xl">
                
                {/* Sidebar: Deadlines and Leaderboard */}
                <div className="col-span-3 p-4 bg-c2 rounded-lg shadow-md">
                    <DeadlinesList />
                </div>
                <div className="col-span-3 p-4 bg-c2 rounded-lg shadow-md">
                    <Leaderboard session={session} />
                </div>
                
                {/* Level Progress */}
                <div className="col-span-6 flex flex-col items-center p-4 bg-c2 rounded-lg shadow-md">
                    <div style={{ width: "250px", height: "250px" }} className="mb-8">
                        <LevelProgress level={5} xp={70} />
                    </div>
                </div>

                {/* Main Content: Add Goal, Attendance Chart */}
                <div className="col-span-6 p-4 bg-c2 rounded-lg shadow-md">
                    <AddGoalForm onAddGoal={handleAddGoal} />
                    <div className="mt-6">
                        <AttendancePieChart />
                    </div>
                </div>

                {/* Remainder Form and Goal Table */}
                <div className="col-span-6 p-4 bg-c2 rounded-lg shadow-md">
                    <DeadlineForm onAddDeadline={addDeadline} />
                    <div className="mt-6 bg-c2 rounded-lg shadow-md p-4">
                        <GoalTable />
                    </div>
                </div>

                {/* Calendar or Scheduler */}
                <div className="col-span-12 p-4 bg-c2 rounded-lg shadow-md">
                    {isModalOpen ? (
                        <SubjectSchedulerModal
                            onScheduleSubmit={handleScheduleSubmit}
                            onClose={() => setIsModalOpen(false)}
                        />
                    ) : (
                        <MyCalendar />
                    )}
                </div>

                {/* Footer Actions */}
                <div className="col-span-12 flex justify-center mt-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-t2 text-white px-4 py-2 rounded mb-4 hover:bg-opacity-80 transition"
                    >
                        Add Subject Schedule
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Page;
