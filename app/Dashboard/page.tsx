"use client";

import React, { useEffect, useState } from "react";
import DeadlinesList from "@/components/deadlines";
import MyCalendar from "@/components/Calendar";
import DeadlineForm from "@/components/Deadlineform";
import Challengetable from "@/components/challenge";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import "../output.css";

// Dynamically import Leaderboard without SSR
const Leaderboard = dynamic(() => import("@/components/leaderboard"), { ssr: false });

// XP chart, also dynamically imported without SSR if necessary
const LevelProgress = dynamic(() => import("@/components/XPchart"), { ssr: false });

interface Deadline {
    name: string;
    description: string;
    deadlineDate: string;
}

function Page() {
    const [session, setSession] = useState<any>(null);
    const router = useRouter();

    const handleAddDeadline = (deadline: Deadline) => {
        console.log(deadline);
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
            <div className="grid grid-cols-12 gap-4 p-4 w-full">
                {/* XP Chart and Deadline Form section centered */}
                <div className="col-span-6 col-start-4 p-4 flex flex-col items-center">
                    <div style={{ width: '250px', height: '250px' }} className="mb-8">
                        <LevelProgress level={5} xp={70} />
                    </div>
                    <div className="w-full max-w-md">
                        <DeadlineForm onAddDeadline={handleAddDeadline} />
                    </div>
                </div>

                {/* DeadlinesList and Leaderboard (as a bar graph) */}
                <div className="col-span-3 p-4 h-full">
                    <DeadlinesList />
                </div>
                <div className="col-span-3 p-4 h-full">
                    <Leaderboard />
                </div>

                {/* Challenge Table and Calendar */}
                <div className="col-span-3 p-4 h-full">
                    <Challengetable />
                </div>
                <div className="col-span-12 p-4 h-full">
                    <MyCalendar />
                </div>
            </div>
        </div>
    );
}

export default Page;
