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
    <div className="flex flex-col items-center py-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Leaderboard</h2>
      <table className="w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="px-4 py-2 font-semibold text-left">Name</th>
            <th className="px-4 py-2 font-semibold text-left">Points</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader) => (
            <tr key={leader.id} className="border-t text-white bg-black">
              <td className="px-4 py-2 text-center">{leader.name}</td>
              <td className="px-4 py-2 text-center">{leader.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
