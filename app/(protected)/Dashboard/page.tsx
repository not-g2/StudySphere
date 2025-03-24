"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import useSessionCheck from "../../hooks/auth";
import DeadlinesList from "@/components/deadlines";
import AttendancePieChart from "@/components/AttendancePieChart";
import GoalTable from "@/components/goalview";

// Dynamically import components that shouldn’t be server‑side rendered.
const Leaderboard = dynamic(() => import("@/components/leaderboard"), { ssr: false });
const LevelProgress = dynamic(() => import("@/components/XPchart"), { ssr: false });

function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState({ xp: 0, level: 0 });
  const router = useRouter();

  // Use custom hook for session checking.
  useSessionCheck(setSession);

  // Fetch profile details once session is available.
  useEffect(() => {
    if (session) {
      console.log(session.user.id, " ", session.user.token)
      fetch("http://localhost:8000/api/profile", {
        headers: { Authorization: `Bearer ${session.user.token}` },
      })
        .then((res) => res.json())
        .then((data) => setProfile({ xp: data.xp, level: data.level }))
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [session]);
  
  return (
    <div style={{ backgroundColor: "#F3F3F4", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "20px" }}>
        {/* Top Row: LevelProgress and AttendancePieChart */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ flex: 1, marginRight: "20px" }}>
            <LevelProgress level={profile.level} xp={profile.xp} />
          </div>
          <div style={{ flex: 1, marginLeft: "20px" }}>
            <AttendancePieChart />
          </div>
        </div>

        {/* Second Row: Leaderboard, DeadlinesList, and GoalTable */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
          <div style={{ flex: 1, backgroundColor: "#F3F3F4", padding: "20px", borderRadius: "8px" }}>
            <Leaderboard session={session} />
          </div>
          <div style={{ flex: 1, backgroundColor: "#F3F3F4", padding: "20px", borderRadius: "8px" }}>
            <DeadlinesList />
          </div>
          <div style={{ flex: 1, backgroundColor: "#F3F3F4", padding: "20px", borderRadius: "8px" }}>
            <GoalTable externalRefresh={0} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
