// Leaderboard.tsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Define the data type for leaderboard entries
interface LeaderboardEntry {
    name: string;
    score: number;
}

// Sample leaderboard data
const data: LeaderboardEntry[] = [
    { name: 'Alice', score: 90 },
    { name: 'Bob', score: 75 },
    { name: 'Charlie', score: 85 },
    { name: 'Diana', score: 70 },
    { name: 'Ethan', score: 95 },
];

const Leaderboard: React.FC = () => {
    return (
        <div className="p-4 bg-c5 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Leaderboard</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#00bfff" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Leaderboard;
