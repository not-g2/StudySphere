"use client";
import React from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

interface FocusData {
    subject: string;
    timeSpent: number;
}

interface FocusRadarChartProps {
    data: FocusData[];
}

const FocusRadarChart: React.FC<FocusRadarChartProps> = ({ data }) => {
    // Aggregate timeSpent by subject
    const aggregatedData = data.reduce<Record<string, number>>((acc, curr) => {
        const { subject, timeSpent } = curr;
        if (acc[subject]) {
            acc[subject] += timeSpent;
        } else {
            acc[subject] = timeSpent;
        }
        return acc;
    }, {});

    const chartData = Object.keys(aggregatedData).map((subject) => ({
        subject,
        timeSpent: aggregatedData[subject],
    }));

    return (
        <div
            style={{
                backgroundColor: "#FF8C00", // Darker orange for the container
                padding: "20px",
                borderRadius: "8px",
                color: "white",
            }}
        >
            <h2 style={{ textAlign: "center" }}>Focus Time per Subject</h2>
            <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={chartData}>
                    <PolarGrid stroke="rgba(255,255,255,0.5)" />
                    <PolarAngleAxis dataKey="subject" stroke="white" />
                    <PolarRadiusAxis stroke="white" />
                    <Radar
                        name="Time Spent"
                        dataKey="timeSpent"
                        stroke="white"
                        fill="#E67E22" // Darker shade of orange for the radar fill
                        fillOpacity={0.6}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#333",
                            border: "none",
                        }}
                        labelStyle={{ color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FocusRadarChart;
