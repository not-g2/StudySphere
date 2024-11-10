import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";

type Deadline = {
  id: string;
  assignmentTitle: string;
  dueDate: string;
  courseName: string;
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
            id: `${deadline.assignmentTitle}-${deadline.dueDate}`, // Ensure unique ID
            assignmentTitle: deadline.assignmentTitle,
            dueDate: deadline.dueDate,
            courseName: deadline.courseName,
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

  // Helper function to calculate days left
  const calculateDaysLeft = (dueDate: string) => {
    const today = new Date();
    const deadlineDate = new Date(dueDate);
    const differenceInTime = deadlineDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays > 0 ? `${differenceInDays} days left` : "Due today";
  };

  return (
    <div className="flex flex-col items-center py-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Deadlines</h2>
      <div className="w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-t2 text-gray-100">
              <th className="text-white px-4 py-2 font-semibold text-center">Assignment</th>
              <th className="text-white px-4 py-2 font-semibold text-center">Course</th>
              <th className="text-white px-4 py-2 font-semibold text-center">Time Left</th>
            </tr>
          </thead>
        </table>
        <div className={`${deadlines.length > 4 ? 'max-h-60 overflow-y-auto' : ''}`}>
          <table className="w-full">
            <tbody>
              {deadlines.map((deadline) => (
                <tr key={deadline.id} className="bg-c5 border-t text-gray-200">
                  <td className="px-4 py-2 text-center">{deadline.assignmentTitle}</td>
                  <td className="px-4 py-2 text-center">{deadline.courseName}</td>
                  <td className="px-4 py-2 text-center">
                    {calculateDaysLeft(deadline.dueDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DeadlinesList;
