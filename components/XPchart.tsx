// components/XPchart.tsx
"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { LevelProgressProps } from "@/types/levelProgress";

////////////////////////////////////////////////////////////////////////
// PRESENTATIONAL: wider bar, bigger text, XP & Aura at ends        //
////////////////////////////////////////////////////////////////////////
const LevelProgress: React.FC<LevelProgressProps> = ({
  level,
  xp,
  auraPoints,
}) => {
  // match DashboardPage left‑column
  const containerWidth = 480;
  return (
    <div
      style={{
        width: containerWidth,
        backgroundColor: "#896EFB",
        borderRadius: 16,
        padding: 16,
        color: "#fff",
        boxSizing: "border-box",
      }}
    >
      {/* bar track */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 24,
          backgroundColor: "#d6d6d6",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* filled portion */}
        <div
          style={{
            width: `${xp}%`,
            height: "100%",
            backgroundColor: "#AC9AFC",
          }}
        />

        {/* level number, centered */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          Level {level}
        </div>
      </div>

      {/* XP% on left, Aura on right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 12,
          fontSize: 16,
        }}
      >
        <span>{xp}% XP</span>
        <span>Aura: {auraPoints}</span>
      </div>
    </div>
  );
};

////////////////////////////////////////////////////////////////////////
// CONTAINER: fetches profile and passes props into LevelProgress   //
////////////////////////////////////////////////////////////////////////
const LevelProgressContainer: React.FC = () => {
  const [level, setLevel] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [auraPoints, setAuraPoints] = useState<number>(0);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const raw = Cookies.get("session");
    if (raw) setSession(JSON.parse(raw));
    else console.error("No session data found in cookies");
  }, []);

  useEffect(() => {
    if (!session?.user?.token) return;

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((data) => {
        const adjustedXp = data.xp > 100 ? data.xp / 10 : data.xp;
        setLevel(data.level);
        setXp(adjustedXp);
        setAuraPoints(data.auraPoints);
      })
      .catch((err) => console.error("Failed to fetch profile data:", err));
  }, [session]);

  return <LevelProgress level={level} xp={xp} auraPoints={auraPoints} />;
};

export default LevelProgressContainer;
