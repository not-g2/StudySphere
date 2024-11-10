import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { PieChart, Pie, Cell } from 'recharts';

interface LevelProgressProps {
  level: number;
  xp: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ level, xp }) => {
  const data = [
    { name: 'XP', value: xp },
    { name: 'Remaining', value: 100 - xp },
  ];

  const COLORS = ['#00bfff', '#d6d6d6'];

  const circleSize = 400;
  const innerRadius = 160;
  const outerRadius = 180;

  return (
    <div style={{ position: 'relative', width: circleSize, height: circleSize }}>
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>Level {level}</div>
        <div style={{ fontSize: '22px' }}>{xp}% XP</div>
      </div>
    </div>
  );
};

const LevelProgressContainer: React.FC = () => {
  const [level, setLevel] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Retrieve session data from cookies on component mount
    const sessionData = Cookies.get('session');
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    } else {
      console.error("No session data found in cookies");
    }
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      if (!session?.user?.token) {
        console.error("Session token is missing");
        return;
      }
  
      try {
        const response = await fetch('http://localhost:8000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${session.user.token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log("Fetched profile data:", data); // Debug line to ensure data is fetched correctly
  
        // Ensure xp is between 0 and 100 by dividing by 10 if it's above 100
        const adjustedXp = data.xp > 100 ? data.xp / 10 : data.xp;
  
        setLevel(data.level);
        setXp(adjustedXp);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };
  
    // Call getProfile only when session is available
    if (session) {
      getProfile();
    }
  }, [session]);
  
  return <LevelProgress level={level} xp={xp} />;
};

export default LevelProgressContainer;
