"use client";
import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Array of 20 distinct colors for subjects.
const colors = [
    "#7c3f6b",
    "#2fa8d4",
    "#d12e7f",
    "#a3c9e1",
    "#5f8b72",
    "#e27d3c",
    "#9b4a1d",
    "#3e7fcd",
    "#f4d231",
    "#c6a1b2",
    "#58e3c4",
    "#1f2d9a",
    "#d5c47e",
    "#a69b23",
    "#7f4d2e",
    "#e3f8a2",
    "#4b1d7c",
    "#c9e87b",
    "#27d4e5",
    "#9e2b4f",
];

interface SubjectTimeData {
    subject: string;
    timeSpent: number;
    date: string;
}

interface SubjectTimeBarChartProps {
    data: SubjectTimeData[];
}

const SubjectTimeBarChart: React.FC<SubjectTimeBarChartProps> = ({ data }) => {
    // Calculate the past 7 days as weekday labels (e.g., "Mon", "Tue") in ascending order.
    const past7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString("en-US", { weekday: "short" });
    });

    // Initialize aggregated data with keys as day labels.
    const aggregatedData: Record<string, any> = {};
    past7Days.forEach((day) => {
        aggregatedData[day] = { day };
    });

    // Aggregate time spent per subject for each day.
    data.forEach((item) => {
        const itemDay = new Date(item.date).toLocaleDateString("en-US", {
            weekday: "short",
        });
        if (aggregatedData[itemDay]) {
            aggregatedData[itemDay][item.subject] =
                (aggregatedData[itemDay][item.subject] || 0) + item.timeSpent;
        }
    });
    const chartData = past7Days.map((day) => aggregatedData[day]);

    // Sequentially assign a distinct color to each subject.
    const subjectColorMap: Record<string, string> = {};
    let colorIndex = 0;
    data.forEach((item) => {
        if (!subjectColorMap[item.subject]) {
            subjectColorMap[item.subject] = colors[colorIndex % colors.length];
            colorIndex++;
        }
    });
    const uniqueSubjects: string[] = Array.from(
        new Set(data.map((item) => item.subject))
    );

    return (
        <div
            style={{
                backgroundColor: "#333333",
                padding: "20px",
                borderRadius: "8px",
            }}
        >
            <h2 style={{ textAlign: "center", color: "white" }}>
                Time Spent per Subject (Past 7 Days)
            </h2>
            <div
                style={{
                    backgroundColor: "#333333",
                    borderRadius: "8px",
                    padding: "10px",
                }}
            >
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#666666" />
                        <XAxis dataKey="day" tick={{ fill: "white" }} />
                        <YAxis tick={{ fill: "white" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#333333",
                                border: "none",
                                color: "white",
                            }}
                            labelStyle={{ color: "white" }}
                            // Convert seconds to minutes by dividing by 60.
                            formatter={(value) =>
                                `${(Number(value) / 60).toFixed(2)} minutes`
                            }
                            labelFormatter={(label) => `Day: ${label}`}
                        />
                        <Legend wrapperStyle={{ color: "white" }} />
                        {Array.from(uniqueSubjects).map((subject) => (
                            <Bar
                                key={subject}
                                dataKey={subject}
                                stackId="a"
                                fill={subjectColorMap[subject]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SubjectTimeBarChart;
