"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

type Assignment = {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  course: string;
  createdAt: string;
  profApproval: boolean;
};

const AssignmentList: React.FC = () => {
  const params = useParams();
  const courseId = params.id; // Retrieve the course ID from the URL
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated' || !token || !courseId) {
      setLoading(false);
      return;
    }

    const fetchAssignments = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/assgn/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch assignments.");
        }

        const data = await response.json();
        console.log("Data received:", data);
        setAssignments(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load assignments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [status, token, courseId]);

  if (loading) {
    return <p className="text-center text-black">Loading assignments...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (assignments.length === 0) {
    return <p className="text-center text-gray-700">No assignments found for this course.</p>;
  }

  return (
    <div className="p-4 min-h-screen bg-c2">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">Assignments</h2>
      <ul className="max-w-md mx-auto space-y-4">
        {assignments.map((assignment) => (
          <li key={assignment._id} className="bg-c5 shadow-md rounded-lg p-4">
            <Link href={`/admin/courses/${courseId}/assignments/assignment/${assignment._id}`}>
              <a className="text-white hover:underline">
                <h3 className="text-lg font-bold">{assignment.title}</h3>
                <p className="mt-2 text-sm">Description: {assignment.description}</p>
                <p className="mt-2 text-sm">Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                <p className="mt-2 text-sm">Status: {assignment.status}</p>
                <p className="mt-2 text-sm">Professor Approval: {assignment.profApproval ? 'Approved' : 'Pending'}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;
