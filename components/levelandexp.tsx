import React from 'react';

interface LevelXPDisplayProps {
  level: number;
  xp: number;
}

const LevelXPDisplay: React.FC<LevelXPDisplayProps> = ({ level, xp }) => {
  return (
    <div className="max-w-sm mx-auto text-center p-6 bg-c3 text-white border border-gray-700 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">Level</h2>
      <p className="text-6xl font-extrabold text-white">{level}</p>
      
      <div className="mt-6">
        <h3 className="text-xl font-bold">XP</h3>
        <p className="text-5xl font-semibold text-green-400">{xp}</p>
      </div>
    </div>
  );
};

export default LevelXPDisplay;
