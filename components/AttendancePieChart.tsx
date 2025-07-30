// components/AttendancePieChart.tsx
"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Label,
} from "recharts";

interface AttendanceData {
  courseName: string;
  attendancePercentage: string;
  totalClasses: number;
  attendedClasses: number;
}

const AttendancePieChart: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [session, setSession] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const raw = Cookies.get("session");
    if (raw) setSession(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (!session?.user?.token || !session?.user?.id) return;
    fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/attendance/breakdown/${session.user.id}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setAttendanceData(data.attendanceByCourse))
      .catch((e) => console.error("Error fetching attendance:", e));
  }, [session]);

  const nextPair = () =>
    setCurrentIndex((i) => (i + 2) % attendanceData.length);

  const renderPie = (entry: AttendanceData) => {
    const pct = parseFloat(entry.attendancePercentage);
    const pieData = [
      { name: "Attended", value: pct },
      { name: "Missed", value: 100 - pct },
    ];
    const renderCenterLabel = (props: any) => {
      const { cx, cy } = props.viewBox;
      return (
        <>
          <text
            x={cx}
            y={cy - 12}
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fill: "#FFF", fontSize: 14, fontWeight: "bold" }}
          >
            {entry.courseName}
          </text>
          <text
            x={cx}
            y={cy + 18}
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fill: "#FFF", fontSize: 16, fontWeight: "bold" }}
          >
            {pct}%
          </text>
        </>
      );
    };

    return (
      <Pie
        data={pieData}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        startAngle={90}
        endAngle={-270}
        dataKey="value"
        labelLine={false}
      >
        <Cell fill="#0C4091" />
        <Cell fill="#90CAF9" />
        <Label content={renderCenterLabel} position="center" />
      </Pie>
    );
  };

  const len = attendanceData.length;

  return (
    <div
      style={{
        width: "100%",
        height: 300,
        background: "#42A5F5",
        borderRadius: 8,
        padding: 16,
        position: "relative",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          color: "#FFF",
          textAlign: "center",
          margin: 0,
          marginBottom: 16,
          fontSize: 18,
        }}
      >
        Attendance
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
          No attendance data
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: 16,
              flex: 1,
            }}
          >
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                {renderPie(attendanceData[currentIndex])}
                <Tooltip formatter={(val: any) => `${val}%`} />
              </PieChart>
            </ResponsiveContainer>

            {len > 1 && (
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  {renderPie(attendanceData[(currentIndex + 1) % len])}
                  <Tooltip formatter={(val: any) => `${val}%`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {len > 2 && (
            <button
              onClick={nextPair}
              style={{
                position: "absolute",
                right: 16,
                top: 16,
                background: "rgba(255,255,255,0.4)",
                border: "none",
                borderRadius: "50%",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default AttendancePieChart;
