// app/(protected)/dashboard/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSessionCheck from "../../hooks/auth";
import DeadlinesList from "@/components/deadlines";
import AttendancePieChart from "@/components/AttendancePieChart";
import GoalTable from "@/components/goalview";
import FocusRadarChart from "@/components/Dashboard/pomoradarchart";
import SubjectTimeBarChart from "@/components/Dashboard/subjecttimechart";
import { Session } from "@/types/session";
import LevelProgressContainer from "@/components/XPchart";
import Leaderboard from "@/components/leaderboard";

function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [focusData, setFocusData] = useState<any[]>([]);
  const router = useRouter();

  useSessionCheck(setSession);

  useEffect(() => {
    if (!session) return;
    fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/pomodoro/fetchuseranalytics/${session.user.id}`,
      { headers: { Authorization: `Bearer ${session.user.token}` } }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.focusdata?.focusSessionData) {
          setFocusData(data.focusdata.focusSessionData);
        }
      })
      .catch((e) => console.error("Error fetching focus analytics:", e));
  }, [session]);

  return (
    <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "20px" }}>

        {/* Top Row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {/* Left column: Level → Leaderboard → Deadlines */}
          <div
            style={{
              width: 480,
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <LevelProgressContainer />

            <div style={{ marginTop: "20px" }}>
              <Leaderboard session={session} />
            </div>

            <div style={{ marginTop: "20px" }}>
              <DeadlinesList />
            </div>
          </div>

          {/* Middle column: Attendance & GoalTable */}
          <div
            style={{
              width: 600,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <AttendancePieChart />
            </div>

            <div
              style={{
                marginTop: "20px",
                backgroundColor: "#FFFFFF",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <GoalTable />
            </div>
          </div>

          {/* Right column: Focus↑ & SubjectTime↓ */}
          {focusData.length > 0 && (
            <div
              style={{
                width: 600,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <FocusRadarChart data={focusData} />
              </div>
              <div
                style={{
                  marginTop: "20px",
                  backgroundColor: "#F3F3F4",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <SubjectTimeBarChart data={focusData} />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
