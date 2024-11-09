"use client";

import React, { useEffect, useState } from "react";
import DeadlinesList from "@/components/deadlines";
import MyCalendar from "@/components/Calendar";
import DeadlineForm from "@/components/Deadlineform";
import Challengetable from "@/components/challenge";
import AddGoalForm from "@/components/addgoal";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import SubjectSchedulerModal from "@/components/timetable"; // Import the scheduler modal
import "../output.css";

// Define the Deadline and Goal types
interface Deadline {
  title: string;
  description: string;
  start: string;
  end: string;
}

interface Goal {
  name: string;
  endDate: string;
}

// Dynamically import Leaderboard and LevelProgress components without SSR
const Leaderboard = dynamic(() => import("@/components/leaderboard"), { ssr: false });
const LevelProgress = dynamic(() => import("@/components/XPchart"), { ssr: false });

function Page() {
    const [session, setSession] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const router = useRouter();

    const handleAddDeadline = (deadline: Deadline) => {
        console.log(deadline);
    };

    const handleAddGoal = (goal: Goal) => {
        console.log("Added goal:", goal);
    };

    const handleScheduleSubmit = (schedule: { subject: string; days: { [day: string]: { startTime: string; endTime: string } } }) => {
        console.log("New schedule submitted:", schedule);
        setIsModalOpen(false); // Close modal on submission
    };

    useEffect(() => {
        const sessionData: string | undefined = Cookies.get("session");

        if (sessionData && !session) {
            setSession(JSON.parse(sessionData));
        } else if (!sessionData) {
            router.push("/auth/signin");
        }
    }, []);

    return (
        <div className="bg-c2 min-h-screen flex flex-col items-center justify-center">
            <div className="grid grid-cols-12 gap-4 p-4 w-full max-w-screen-xl">
                {/* Leaderboard on the left */}
                <div className="col-span-3 p-4 h-full">
                    <Leaderboard />
                </div>

                {/* Center section with XP Chart */}
                <div className="col-span-6 flex flex-col items-center p-4">
                    <div style={{ width: '400px', height: '400px' }} className="mb-8">
                        <LevelProgress level={5} xp={70} />
                    </div>
                </div>

                {/* DeadlinesList on the right */}
                <div className="col-span-3 p-4 h-full">
                    <DeadlinesList />
                </div>

                {/* Add Deadline and Add Goal side by side */}
                <div className="col-span-6 p-4 h-full bg-c2 rounded-lg shadow-md">
                    <DeadlineForm onAddDeadline={handleAddDeadline} />
                </div>
                
                <div className="col-span-6 p-4 h-full bg-c2 rounded-lg shadow-md">
                    <AddGoalForm onAddGoal={handleAddGoal} />
                    
                    {/* Challenges table directly under Add Goal */}
                    <div className="mt-6">
                        <Challengetable />
                    </div>
                </div>

                {/* Full-width Calendar at the bottom */}
                <div className="col-span-12 p-4 h-full bg-c2 rounded-lg shadow-md">
                    {/* Render the SubjectSchedulerModal directly when isModalOpen is true */}
                    {isModalOpen ? (
                        <SubjectSchedulerModal
                            subjects={["Math", "Science", "History"]}
                            onScheduleSubmit={handleScheduleSubmit}
                            onClose={() => setIsModalOpen(false)} // Close modal function
                        />
                    ) : (
                        <MyCalendar />
                    )}
                </div>

                {/* Button to open the SubjectSchedulerModal */}
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
