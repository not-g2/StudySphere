"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface Challenge {
  name: string;
  description: string;
  endDate: string;
}

interface ChallengeTableProps {
  challenges: Challenge[];
}

const ChallengeTable: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve session data from cookies
    const sessionData = Cookies.get("session");

    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      setSession(parsedSession);
    } else {
      router.push("/auth/signin"); // Redirect if no session data
    }
  }, [router]);

  useEffect(() => {
    // Fetch challenges if session is available
    const fetchChallenges = async () => {
      if (session?.user?.token) {
        try {
          const response = await fetch('http://localhost:8000/api/goals/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.user.token}`, // Use token from session
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch challenges');
          }

          const data = await response.json();
          const formattedChallenges = data.map((goal: any) => ({
            name: goal.title,
            description: goal.description,
            endDate: goal.dueDate,
          }));
          setChallenges(formattedChallenges);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch challenges. Please try again.");
        }
      }
    };

    fetchChallenges();
  }, [session]);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-white text-center">Challenges</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <table className="min-w-full border border-gray-700 rounded-lg bg-c5 text-white">
        <thead className="bg-t2 text-black">
          <tr>
            <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold text-white">Name</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold text-white">Description</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold text-white">End Date</th>
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
