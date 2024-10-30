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
    <div className="p-4 flex">
      <div className="w-1/3">
        <h2 className="text-2xl font-bold mb-4">Deadlines</h2>
        <table className="w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-4 border">Deadline Name</th>
              <th className="py-2 px-4 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {deadlines.map((deadline) => (
              <tr key={deadline.id} className="text-center">
                <td className="py-2 px-4 border">{deadline.name}</td>
                <td className="py-2 px-4 border">{new Date(deadline.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeadlinesList;
