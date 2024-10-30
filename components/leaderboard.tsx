import React from 'react';

const leaders = [
  { id: 1, name: 'Alice', points: 250 },
  { id: 2, name: 'Bob', points: 200 },
  { id: 3, name: 'Charlie', points: 150 },
  { id: 4, name: 'Diana', points: 120 },
  { id: 5, name: 'Eve', points: 100 },
];

function Leaderboard() {
  return (
    <div className="p-4 flex">
      <div className="w-1/3">
        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <table className="w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Points</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader) => (
              <tr key={leader.id} className="text-center">
                <td className="py-2 px-4 border">{leader.name}</td>
                <td className="py-2 px-4 border">{leader.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
