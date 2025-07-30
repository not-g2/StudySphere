// components/Dashboard/subjecttimechart.tsx
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

interface SubjectTimeData {
  subject: string;
  timeSpent: number; // in seconds
  date: string;      // ISO date string
}

interface SubjectTimeBarChartProps {
  data: SubjectTimeData[];
}

// 20 distinct colors
const colors = [
  "#7c3f6b", "#2fa8d4", "#d12e7f", "#a3c9e1", "#5f8b72",
  "#e27d3c", "#9b4a1d", "#3e7fcd", "#f4d231", "#c6a1b2",
  "#58e3c4", "#1f2d9a", "#d5c47e", "#a69b23", "#7f4d2e",
  "#e3f8a2", "#4b1d7c", "#c9e87b", "#27d4e5", "#9e2b4f",
];

const SubjectTimeBarChart: React.FC<SubjectTimeBarChartProps> = ({ data }) => {
  // Past 7 days labels
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });

  // Initialize aggregation container
  const aggregated: Record<string, any> = {};
  past7Days.forEach((day) => {
    aggregated[day] = { day };
  });

  // Aggregate timeSpent per subject per day
  data.forEach((item) => {
    const itemDay = new Date(item.date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    if (aggregated[itemDay]) {
      aggregated[itemDay][item.subject] =
        (aggregated[itemDay][item.subject] || 0) + item.timeSpent;
    }
  });

  const chartData = past7Days.map((day) => aggregated[day]);

  // Map each subject to a color
  const subjectColorMap: Record<string, string> = {};
  let colorIndex = 0;
  data.forEach((item) => {
    if (!subjectColorMap[item.subject]) {
      subjectColorMap[item.subject] = colors[colorIndex % colors.length];
      colorIndex++;
    }
  });

  const uniqueSubjects = Array.from(
    new Set(data.map((item) => item.subject))
  );

  return (
    <div
      style={{
        backgroundColor: "#333333",
        padding: "20px 20px 40px", // extra bottom padding so XAxis labels fit
        borderRadius: "8px",
        color: "white",
        height: 360,          // reduced from 400px → 360px (90%)
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ textAlign: "center", margin: "0 0 12px", color: "white" }}>
        Time Spent per Subject (Past 7 Days)
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }} // increased bottom margin
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#666666" />
          <XAxis dataKey="day" tick={{ fill: "white" }} />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#333333", border: "none" }}
            labelStyle={{ color: "white" }}
            formatter={(value) =>
              `${(Number(value) / 60).toFixed(2)} minutes`
            }
            labelFormatter={(label) => `Day: ${label}`}
          />

          {/* only show the legend if we have subjects */}
          {uniqueSubjects.length > 0 && (
            <Legend wrapperStyle={{ color: "white" }} />
          )}

          {/* render bars only if there are subjects */}
          {uniqueSubjects.length > 0
            ? uniqueSubjects.map((subject) => (
                <Bar
                  key={subject}
                  dataKey={subject}
                  stackId="a"
                  fill={subjectColorMap[subject]}
                />
              ))
            : null}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubjectTimeBarChart;
