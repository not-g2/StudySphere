import React from 'react';

interface Challenge {
  name: string;
  description: string;
  endDate: string;
}

interface ChallengeTableProps {
  challenges: Challenge[];
}

const ChallengeTable: React.FC<ChallengeTableProps> = ({ challenges }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-700 rounded-lg bg-c3 text-white">
        <thead className="bg-c5 text-black">
          <tr>
            <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold">Name</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold">Description</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold">End Date</th>
          </tr>
        </thead>
        <tbody>
          {challenges.map((challenge, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b border-gray-700">{challenge.name}</td>
              <td className="py-2 px-4 border-b border-gray-700">{challenge.description}</td>
              <td className="py-2 px-4 border-b border-gray-700">{challenge.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChallengeTable;
