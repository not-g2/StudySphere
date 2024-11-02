import React from "react";

const dailyChallenges = [
  { title: "Daily Challenge", description: "Complete 5 math exercises." },
  { title: "Daily Challenge", description: "Read a science article." },
];

const Challengetable = () => {
  return (
    <div className="flex flex-col items-center py-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Daily Challenges</h1>

      {/* Render the daily challenges as two centered tables with consistent styling */}
      <div className="space-y-6 w-full">
        {dailyChallenges.map((challenge, index) => (
          <table
            key={index}
            className="w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden"
          >
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-700 text-left font-semibold text-white">Title</th>
                <th className="px-4 py-2 bg-gray-700 text-left font-semibold text-white">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t text-gray-700">
                <td className="bg-black px-4 py-2 text-center text-white">{challenge.title}</td>
                <td className="bg-black px-4 py-2 text-center text-white">{challenge.description}</td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
};

export default Challengetable;
