"use client";

import React from "react";
import { PieChart, Pie, Cell } from "recharts";

// Define the props interface directly in this file if you're having issues with imports
interface LevelProgressProps {
    level: number;
    xp: number;
}

const LevelProgressContainer: React.FC<LevelProgressProps> = ({
    level,
    xp,
}) => {
    const Adjustedxp = Number(
        ((xp / (100 * (level + 1) ** 2)) * 100).toFixed(2)
    );

    const data = [
        { name: "XP", value: Adjustedxp },
        { name: "Remaining", value: 100 - Adjustedxp },
    ];

    // Use these colours: progress is a lighter blue, remaining is light gray.
    const COLORS = ["#AC9AFC", "#d6d6d6"];

    const circleSize = 400;
    const innerRadius = 160;
    const outerRadius = 180;

    return (
        <div
            tabIndex={-1}
            style={{
                position: "relative",
                width: circleSize,
                height: circleSize,
                backgroundColor: "#896EFB",
                borderRadius: "50%",
                outline: "none",
            }}
        >
            <PieChart width={circleSize} height={circleSize}>
                <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={0}
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    color: "#fff",
                }}
            >
                <div style={{ fontSize: "36px", fontWeight: "bold" }}>
                    Level {level}
                </div>
                <div style={{ fontSize: "22px" }}>{Adjustedxp}% XP</div>
            </div>
        </div>
    );
};

export default LevelProgressContainer;
