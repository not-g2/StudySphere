import React from 'react';

type Deadline = {
  id: number;
  name: string;
  date: string;
};

function DeadlinesList() {
  const deadlines: Deadline[] = [
    { id: 2, name: "Midterm Exam", date: "2024-11-05" },
    { id: 1, name: "Project Submission", date: "2024-11-10" },
    { id: 3, name: "Final Presentation", date: "2024-12-01" }
  ];

  return (
    <div className="flex flex-col items-center py-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Deadlines</h2>
      <table className="w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700 text-gray-100">
            <th className="px-4 py-2 font-semibold text-left">Deadline</th>
            <th className="px-4 py-2 font-semibold text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {deadlines.map((deadline) => (
            <tr key={deadline.id} className="bg-black border-t text-gray-200">
              <td className="px-4 py-2 text-center">{deadline.name}</td>
              <td className="px-4 py-2 text-center">
                {new Date(deadline.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeadlinesList;
