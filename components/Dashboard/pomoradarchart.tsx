// components/Dashboard/FocusRadarChart.tsx
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
    acc[subject] = (acc[subject] || 0) + timeSpent;
    return acc;
  }, {});

  const chartData = Object.keys(aggregatedData).map((subject) => ({
    subject,
    timeSpent: aggregatedData[subject],
  }));

  const len = chartData.length;

  return (
    <div
      style={{
        backgroundColor: "#FF8C00",
        padding: "20px",
        borderRadius: "8px",
        color: "white",
        height: 360,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ textAlign: "center", margin: "0 0 12px" }}>
        Focus Time per Subject
      </h2>

      {len === 0 ? (
        <div
          style={{
            flex: 1,
            border: "2px dashed rgba(255,255,255,0.6)",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.8)",
            fontStyle: "italic",
          }}
        >
          No focus data
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="rgba(255,255,255,0.5)" />
              <PolarAngleAxis dataKey="subject" stroke="white" />
              <PolarRadiusAxis stroke="white" />
              <Radar
                name="Time Spent"
                dataKey="timeSpent"
                stroke="white"
                fill="#E67E22"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", border: "none" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default FocusRadarChart;
