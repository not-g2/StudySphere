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

// Define the data type for leaderboard entries
interface LeaderboardEntry {
    _id: string;
    name: string;
    auraPoints: number;
}

interface LeaderboardProps {
    session: any;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ session }) => {
    const [leaderboardEntries, setLeaderboardEntries] = useState<
        LeaderboardEntry[]
    >([]);

    useEffect(() => {
        const getLeaderboard = async () => {
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
                    const updatedUsers = data.users.map(
                        (user: LeaderboardEntry) => ({
                            ...user,
                            name: user.name || `User(${user._id})`,
                        })
                    );
                    setLeaderboardEntries(updatedUsers);
                } else {
                    console.error("Failed to get leaderboard Details");
                }
            } catch (error) {
                console.error("Error Getting leaderboard:", error);
            }
        };
        getLeaderboard();
    }, [session]);

    return (
        <div className="p-4 bg-c5 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
                Leaderboard
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={leaderboardEntries}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="auraPoints" fill="#00bfff" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Leaderboard;
