import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";

type Deadline = {
  id: number;
  name: string;
  date: string;
};

function DeadlinesList() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const sessionData = Cookies.get("session");
        
        if (!sessionData) {
          console.error("No session data found");
          return;
        }

        const session = JSON.parse(sessionData);
        const userId = session.user?.id;

        if (!userId) {
          console.error("User ID is missing in session data");
          return;
        }

        const response = await fetch(`http://localhost:8000/api/users/${userId}/deadlines`);
        if (response.ok) {
          const data = await response.json();
          const formattedDeadlines = data.deadlines.map((deadline: any) => ({
            id: deadline.id || `${deadline.assignmentTitle}-${deadline.dueDate}`, // Use a unique ID or fallback
            name: deadline.assignmentTitle,
            date: deadline.dueDate,
          }));
          setDeadlines(formattedDeadlines);
        } else {
          console.error("Failed to fetch deadlines", response.status);
        }
      } catch (error) {
        console.error("Error fetching deadlines:", error);
      }
    };

    fetchDeadlines();
  }, []);

  return (
    <div className="flex flex-col items-center py-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Deadlines</h2>
      <table className="w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <thead>
          <tr className="bg-t2 text-gray-100">
            <th className="text-white px-4 py-2 font-semibold text-center">Deadline</th>
            <th className="text-white px-4 py-2 font-semibold text-center">Date</th>
          </tr>
        </thead>
        <tbody>
          {deadlines.map((deadline) => (
            <tr key={deadline.id} className="bg-c5 border-t text-gray-200">
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
