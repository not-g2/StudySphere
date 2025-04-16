"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Label,
} from "recharts";

interface AttendanceData {
    courseName: string;
    attendancePercentage: string;
    totalClasses: number;
    attendedClasses: number;
}

const AttendancePieChart: React.FC<{ attendanceData: AttendanceData[] }> = ({
    attendanceData,
}) => {
    return (
        <div
            className="w-full px-4"
            style={{
                backgroundColor: "#42A5F5", // Slightly darker background
                padding: "20px",
                borderRadius: "8px",
                maxWidth: "800px",
                margin: "0 auto",
            }}
        >
            <h2
                style={{
                    color: "#FFFFFF",
                    textAlign: "center",
                    marginBottom: "10px",
                    fontSize: "28px",
                    fontWeight: "bold",
                }}
            >
                Attendance
            </h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "5px",
                    padding: "10px 0",
                }}
            >
                {attendanceData.map((data, index) => {
                    const percentage = parseFloat(data.attendancePercentage);
                    const pieData = [
                        { name: "Attended", value: percentage },
                        { name: "Missed", value: 100 - percentage },
                    ];

                    // Custom center label with white text
                    const renderCenterLabel = (props: any) => {
                        const { cx, cy } = props.viewBox;
                        return (
                            <>
                                <text
                                    x={cx}
                                    y={cy - 10}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    style={{
                                        fill: "#FFFFFF",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {data.courseName}
                                </text>
                                <text
                                    x={cx}
                                    y={cy + 15}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    style={{
                                        fill: "#FFFFFF",
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {percentage}%
                                </text>
                            </>
                        );
                    };

                    return (
                        <div key={index} className="text-center">
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        labelLine={false}
                                    >
                                        <Cell key="attended" fill="#0C4091" />
                                        <Cell key="missed" fill="#90CAF9" />
                                        <Label
                                            content={renderCenterLabel}
                                            position="center"
                                        />
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AttendancePieChart;
