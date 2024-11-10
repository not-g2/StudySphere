"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface Goal {
  _id: string;
  name: string;
  endDate: string;
}

const GoalTable: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  // Retrieve session from cookies and handle redirection
  useEffect(() => {
    const sessionData = Cookies.get("session");

    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      setSession(parsedSession);
    } else {
      router.push("/auth/signin"); // Redirect if no session data
    }
  }, [router]);

  // Fetch goals when session is available
  useEffect(() => {
    const fetchGoals = async () => {
      if (session?.user?.token) {
        try {
          const response = await fetch('http://localhost:8000/api/goals/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.user.token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch goals');
          }

          const data = await response.json();
          const formattedGoals = data.map((goal: any) => ({
            _id: goal._id,
            name: goal.title,
            endDate: goal.dueDate,
          }));
          setGoals(formattedGoals);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch goals. Please try again.");
        }
      }
    };

    fetchGoals();
  }, [session]);

  // Delete goal by ID
  const deleteGoal = async (id: string) => {
    if (session?.user?.token) {
      try {
        console.log(id);
        const response = await fetch(`http://localhost:8000/api/goals/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete goal');
        }

        // Remove the deleted goal from the state
        setGoals(goals.filter(goal => goal._id !== id));
      } catch (err) {
        console.error(err);
        setError("Failed to delete goal. Please try again.");
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-white text-center">Goals</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <table className="min-w-full border border-gray-700 rounded-lg bg-c5 text-white">
        <thead className="bg-t2 text-black">
          <tr>
            <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold text-white">Goal Name</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold text-white">End Date</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((goal) => (
            <tr key={goal._id}>
              <td className="py-2 px-4 border-b border-gray-700">{goal.name}</td>
              <td className="py-2 px-4 border-b border-gray-700">
                {new Date(goal.endDate).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b border-gray-700">
                <button
                  onClick={() => deleteGoal(goal._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GoalTable;
