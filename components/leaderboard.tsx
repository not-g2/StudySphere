// components/leaderboard.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface LeaderboardEntry {
  _id: string;
  name: string;
  level: number;
}

interface LeaderboardProps {
  session: any;
}

const truncateName = (name: string): string =>
  name.length > 10 ? name.slice(0, 10) + "…" : name;

export default function Leaderboard({ session }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const MAX_DISPLAY = 10;

  useEffect(() => {
    if (!session) return;
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/top-10-aura`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        const users: LeaderboardEntry[] = data.users.map((u: any) => ({
          _id: u._id,
          name: u.name || `User(${u._id})`,
          level: u.level ?? 0,
        }));
        setEntries(users);
      })
      .catch(console.error);
  }, [session]);

  const currentUserId = session?.user?.id;
  if (!entries.length) return null;

  // 1) Grab the top MAX_DISPLAY.
  const topList = entries.slice(0, MAX_DISPLAY);
  const inTopList = topList.some((e) => e._id === currentUserId);

  // 2) If you're not in that list, replace the last slot with you.
  const youEntry = entries.find((e) => e._id === currentUserId) || {
    _id: currentUserId,
    name: "You",
    level: 0,
  };
  let display = inTopList
    ? topList
    : [...entries.slice(0, MAX_DISPLAY - 1), youEntry];

  // 3) Truncate names
  display = display.map((e) => ({ ...e, name: truncateName(e.name) }));

  // 4) Compute max for axis scaling
  const maxLevel = Math.max(...display.map((e) => e.level), 10);

  // 5) Dynamic height: ~40px per bar
  const chartHeight = display.length * 40;

  return (
    <div style={{ width: "100%" }} className="p-4 bg-green-500 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Leaderboard</h2>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={display}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, maxLevel]}
            tick={{ fill: "#fff" }}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={100}
            tick={{ fill: "#fff" }}
          />
          <Tooltip />
          <Bar dataKey="level" barSize={20} isAnimationActive={false}>
            {display.map((entry) => (
              <Cell
                key={entry._id}
                fill={entry._id === currentUserId ? "#006400" : "#90ee90"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
