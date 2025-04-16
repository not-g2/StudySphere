"use client";

import React, { useState } from "react";
import AddGoalForm from "@/components/addgoal";
import DeadlineForm from "@/components/Deadlineform";
import GoalTable from "@/components/goalview";
import Challengetable from "@/components/challenge";
import useSessionCheck from "../../../hooks/auth";

interface Goal {
    name: string;
    endDate: string;
}

const fetchGoals = async (token: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/goals/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => {
            if (!res.ok) return null;
            return res.json();
        })
        .then((data) => {
            const formattedGoals = data.map((goal: any) => ({
                _id: goal._id,
                name: goal.title,
                endDate: goal.dueDate,
            }));
            formattedGoals.sort(
                (a: Goal, b: Goal) =>
                    new Date(b.endDate).getTime() -
                    new Date(a.endDate).getTime()
            );
            return formattedGoals;
        });
};

function ThirdRowPage() {
    const [session, setSession] = useState<any>(null);
    const [goalRefresh, setGoalRefresh] = useState(0);
    useSessionCheck(setSession);

    // When a goal is added, trigger a refresh so that GoalTable fetches the new goal.
    const handleAddGoal = (goal: Goal) => {
        console.log("Added goal:", goal);
        setGoalRefresh((prev) => prev + 1);
    };

    function addDeadline(deadline: any): void {
        async function createReminder(deadlineData: any) {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/reminder/reminders`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(deadlineData),
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
        createReminder(deadline);
    }

    return (
        <div className="bg-c2" style={{ padding: "20px", minHeight: "100vh" }}>
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                    marginTop: "20px",
                }}
            >
                <div style={{ flex: 1 }}>
                    <AddGoalForm onAddGoal={handleAddGoal} />
                </div>
                <div style={{ flex: 1 }}>
                    <DeadlineForm onAddDeadline={addDeadline} />
                </div>
                <div style={{ flex: 1 }}>
                </div>
                <div style={{ flex: 1 }}>
                    <Challengetable />
                </div>
            </div>
        </div>
    );
}

export default ThirdRowPage;
