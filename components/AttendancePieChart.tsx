"use client";
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label } from 'recharts';

interface AttendanceData {
  courseName: string;
  attendancePercentage: string;
  totalClasses: number;
  attendedClasses: number;
}

const AttendancePieChart: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const sessionData = Cookies.get('session');
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    } else {
      console.error("No session data found in cookies");
    }
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!session?.user?.token || !session?.user?.id) {
        console.error("Session data or user token missing");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8000/api/attendance/breakdown/${session.user.id}`,
          {
            headers: {
              "Authorization": `Bearer ${session.user.token}`,
              "Content-Type": "application/json",
            }
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAttendanceData(data.attendanceByCourse);
        } else {
          console.error("Failed to fetch attendance data, response status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    if (session) {
      fetchAttendanceData();
    }
  }, [session]);

  return (
    // Card container with background color #F3F3F4
    <div className="w-full px-4" style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "8px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: 'grid',
          // Use auto-fit to let columns wrap, with a fixed minimum width
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '5px', // Reduced gap horizontally and vertically
          padding: '10px 0'
        }}
      >
        {attendanceData.map((data, index) => {
          const percentage = parseFloat(data.attendancePercentage);
          const pieData = [
            { name: 'Attended', value: percentage },
            { name: 'Missed', value: 100 - percentage },
          ];

          // Compute the larger slice percentage (if less than 50, show absentee percentage)
          const largerPercentage = percentage >= 50 ? percentage : 100 - percentage;

          // Custom label to render in the center of the pie chart.
          const renderCenterLabel = (props: any) => {
            const { cx, cy } = props.viewBox;
            return (
              <>
                <text
                  x={cx}
                  y={cy - 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ fill: "#000000", fontSize: "14px", fontWeight: "bold" }}
                >
                  {data.courseName}
                </text>
                <text
                  x={cx}
                  y={cy + 15}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ fill: "#000000", fontSize: "16px", fontWeight: "bold" }}
                >
                  {largerPercentage}%
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
                    <Cell key="attended" fill="#82ca9d" />
                    <Cell key="missed" fill="#8884d8" />
                    <Label content={renderCenterLabel} position="center" />
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
