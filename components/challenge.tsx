"use client"
import React from "react";

const dailyChallenges = [
  { title: "Daily Challenge", description: "Complete 5 math exercises." },
  { title: "Weekly Challenge", description: "Read a science article." },
  { title: "Monthly Challenge", description: "Write a book summary." },
  { title: "Fitness Challenge", description: "Run 3 miles." },
  // Add more challenges as needed
];

const Challengetable = () => {
  return (
    <div className="flex flex-col items-center max-w-md">
      <h1 className="text-xl font-bold mb-4 text-white">Challenges</h1>
      {/* Single scrollable table */}
      <div className="w-full overflow-y-auto max-h-64">
        <table className="w-full border rounded-lg shadow-lg overflow-hidden">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-t2 text-center font-semibold text-white">
                Title
              </th>
              <th className="px-4 py-2 bg-t2 text-center font-semibold text-white">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {dailyChallenges.map((challenge, index) => (
              <tr key={index} className="border-t text-gray-700">
                <td className="bg-c5 px-4 py-2 text-center text-white">
                  {challenge.title}
                </td>
                <td className="bg-c5 px-4 py-2 text-center text-white">
                  {challenge.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Challengetable;
