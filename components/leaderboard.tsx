"use client";
import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface LeaderboardEntry {
    _id: string;
    name: string;
    level: number;
}

interface LeaderboardProps {
    session: any;
}

// Helper function to truncate names longer than 10 characters
const truncateName = (name: string): string => {
    return name.length > 10 ? name.slice(0, 10) + "..." : name;
};

const Leaderboard: React.FC<LeaderboardProps> = ({ session }) => {
    const [leaderboardEntries, setLeaderboardEntries] = useState<
        LeaderboardEntry[]
    >([]);

    useEffect(() => {
        const getLeaderboard = async () => {
            if (!session) return;
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/data/top-10-aura`,
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
                    const updatedUsers = data.users.map(
                        (user: LeaderboardEntry) => ({
                            ...user,
                            name: user.name || `User(${user._id})`,
                            level: user.level || 0,
                        })
                    );
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

    // Determine if current user is in the top 4
    const currentUserId = session?.user?.id;
    const topFour = leaderboardEntries.slice(0, 4);
    const isCurrentUserInTopFour = topFour.some(
        (entry) => entry._id === currentUserId
    );

    // Build the combined data based on whether the current user is in top four or not
    let combinedData: LeaderboardEntry[] = [];
    if (isCurrentUserInTopFour) {
        // If the current user is in the top 4, display the top 5 entries
        combinedData = leaderboardEntries.slice(0, 5);
    } else {
        // If not, add the current user's entry as the 5th entry
        const userEntry = leaderboardEntries.find(
            (entry) => entry._id === currentUserId
        ) || { _id: currentUserId, name: "You", level: 0 };
        combinedData = [...topFour, userEntry];
    }

    // Create a new data array with truncated names
    const displayedData = combinedData.map((entry) => ({
        ...entry,
        name: truncateName(entry.name),
    }));

    // Determine the maximum level to set the XAxis domain
    const maxLevel = Math.max(...displayedData.map((entry) => entry.level), 10);

    return (
        <div className="p-4 bg-green-500 rounded-lg shadow-lg w-full">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
                Leaderboard
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={displayedData}
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
                        {displayedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={
                                    entry._id === currentUserId
                                        ? "#006400"
                                        : "#90ee90"
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Leaderboard;
