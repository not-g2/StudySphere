"use client";
import React, { useEffect, useState } from "react";
import DeadlinesList from "@/components/deadlines";
import Leaderboard from "@/components/leaderboard";
import MyCalendar from "@/components/Calendar";
import DeadlineForm from "@/components/Deadlineform";
import Challengetable from "@/components/challenge";
import "../output.css";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Define the type for deadline entries
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
        // const [deadlines, setDeadlines] = useState<Deadline[]>([]);
        // const [leaderboard, setLeaderboard] = useState<string[]>([]);

        // useEffect(() => {
        //   fetch('/api/data')
        //     .then(response => response.json())
        //     .then(data => {
        //       setDeadlines(data.deadlines);
        //       setLeaderboard(data.leaderboard);
        //     })
        //     .catch(error => console.error('Error fetching data:', error));
        // }, []);

        // const handleAddDeadline = (deadline: Deadline) => {
        //   console.log(deadline);
        // };
        <div className="bg-c2 min-h-screen">
            <div className="grid grid-cols-12 gap-4 p-4 h-full">
                {/* DeadlinesList with 3 columns (25%) */}
                <div className="col-span-3 p-4 h-full">
                    <DeadlinesList />
                </div>

                {/* Leaderboard with 3 columns (25%) */}
                <div className="col-span-3 p-4 h-full">
                    <Leaderboard />
                </div>

                {/* NewComponent with 3 columns (25%) between Leaderboard and DeadlineForm */}
                <div className="col-span-3 p-4 h-full">
                    <Challengetable />
                </div>

                {/* DeadlineForm with 3 columns (25%) */}
                {/* <div className="col-span-3 p-4 h-full">
          <DeadlineForm onAddDeadline={handleAddDeadline} />
        </div> */}

                {/* Calendar spans the full width below the other components */}
                <div className="col-span-12 p-4 h-full">
                    <MyCalendar />
                </div>
            </div>
        </div>
    );
}

export default Page;
