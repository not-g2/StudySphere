import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Text } from 'recharts';

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
      const parsedSession = JSON.parse(sessionData);
      setSession(parsedSession);
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
        const response = await fetch(`http://localhost:8000/api/attendance/breakdown/${session.user.id}`, {
          headers: {
            "Authorization": `Bearer ${session.user.token}`,
            "Content-Type": "application/json",
          }
        });
        
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

  const renderCustomLabel = (attendancePercentage: string) => {
    return ({ x, y }: { x: number; y: number }) => (
      <Text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="16px" fontWeight="bold">
        {attendancePercentage}%
      </Text>
    );
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
      {attendanceData.map((data, index) => {
        const percentage = parseFloat(data.attendancePercentage);
        const pieData = [
          { name: 'Attended', value: percentage },
          { name: 'Missed', value: 100 - percentage },
        ];
        
        return (
          <div key={index} style={{ width: '200px', height: '200px', textAlign: 'center' }}>
            <h3>{data.courseName}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
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
                  label={renderCustomLabel(data.attendancePercentage)}
                >
                  <Cell key="attended" fill="#82ca9d" />
                  <Cell key="missed" fill="#8884d8" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
};

export default AttendancePieChart;
