import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

interface LevelProgressProps {
  level: number; // Level should be a number
  xp: number;    // XP percentage should also be a number
}

const LevelProgress: React.FC<LevelProgressProps> = ({ level, xp }) => {
  const data = [
    { name: 'XP', value: xp },
    { name: 'Remaining', value: 100 - xp },
  ];

  const COLORS = ['#00bfff', '#d6d6d6']; // Progress color and background trail color

  const circleSize = 400; // Increase the size to match the height of Leaderboard
  const innerRadius = 160; // Adjust inner radius to maintain ring thickness
  const outerRadius = 180; // Adjust outer radius to maintain ring thickness

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
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
      {/* Centered Level Text */}
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

export default LevelProgress;
