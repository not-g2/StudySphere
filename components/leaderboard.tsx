import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LeaderboardEntry {
  _id: string;
  name: string;
  level: number;
}

interface LeaderboardProps {
  session: any;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ session }) => {
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const getLeaderboard = async () => {
      if (!session) return;
      try {
        const response = await fetch(
          "http://localhost:8000/api/data/top-10-aura",
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
              "Content-Type": "application/json",
            },
            method: "GET",
          }
        );
        if (response.ok) {
          const data = await response.json();
          // Ensure each user has a name and level (using defaults if missing)
          const updatedUsers = data.users.map((user: LeaderboardEntry) => ({
            ...user,
            name: user.name || `User(${user._id})`,
            level: user.level || 0,
          }));
          setLeaderboardEntries(updatedUsers);
        } else {
          console.error("Failed to get leaderboard details");
        }
      } catch (error) {
        console.error("Error getting leaderboard:", error);
      }
    };
    getLeaderboard();
  }, [session]);

  // Get the top 4 entries
  const topFour = leaderboardEntries.slice(0, 4);

  // Get the current user's entry or create a default if not found
  const userEntry =
    leaderboardEntries.find((entry) => entry._id === session?.user?.id) ||
    { _id: session?.user?.id, name: "You", level: 0 };

  // Combine the top four and the user's entry
  const combinedData = [...topFour, userEntry];

  // Determine the maximum level to set the XAxis domain
  const maxLevel = Math.max(...combinedData.map((entry) => entry.level), 10);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold text-black mb-4 text-center">Leaderboard</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={combinedData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, maxLevel]} />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="level" fill="#00bfff" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Leaderboard;
