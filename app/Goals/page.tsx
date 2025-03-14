"use client";

import React from "react";
import AddGoalForm from "@/components/addgoal";
import DeadlineForm from "@/components/Deadlineform";
import GoalTable from "@/components/goalview";
import Challengetable from "@/components/challenge";

interface Goal {
  name: string;
  endDate: string;
}

function ThirdRowPage() {
  const handleAddGoal = (goal: Goal) => {
    console.log("Added goal:", goal);
  };

  function addDeadline(deadline: any): void {
    async function createReminder(deadlineData: any) {
      try {
        const response = await fetch("http://localhost:8000/api/reminder/reminders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
          <GoalTable />
        </div>
        <div style={{ flex: 1 }}>
          <Challengetable />
        </div>
      </div>
    </div>
  );
}

export default ThirdRowPage;
