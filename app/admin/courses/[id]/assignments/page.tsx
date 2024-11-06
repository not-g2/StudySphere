"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type Assignment = {
  _id: string;
  title: string;
  description?: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  createdAt: string;
  profApproval: boolean;
  createdBy: string;
  gDriveLink?: string;
};

const AssignmentList: React.FC = () => {
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated' || !token) {
      setLoading(false);
      return;
    }

    const fetchAssignments = async () => {
      try {
        console.log(token);
        const response = await fetch('http://localhost:8000/api/assgn/course/672a0dcdbddb3f6f6c16ee46', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'GET',
        });
    
        const contentType = response.headers.get('content-type');
    
        if (!response.ok) {
          let errorMessage = `Failed to fetch assignments: ${response.status} ${response.statusText}`;
    
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const errorText = await response.text();
            console.error('Server Error Response:', errorText);
          }
    
          throw new Error(errorMessage);
        }
    
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setAssignments(data);
        } else {
          const textData = await response.text();
          console.error('Unexpected non-JSON response:', textData);
          throw new Error('Server returned an unexpected response format.');
        }
      } catch (err) {
        const error = err as Error;
        console.error('Fetch error:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    

    fetchAssignments();
  }, [status, token]);

  if (loading) {
    return <p className="text-center text-black">Loading assignments...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (assignments.length === 0) {
    return <p className="text-center text-gray-700">No assignments found.</p>;
  }

  return (
    <div className="p-4 min-h-screen bg-c2">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">Assignments</h2>
      <ul className="max-w-md mx-auto space-y-4">
        {assignments.map((assignment) => (
          <li key={assignment._id} className="bg-c5 p-4 rounded-lg shadow-md">
            <Link
              href={`/admin/courses/${assignment.course}/assignments/assignment/${assignment._id}`}
              className="text-white hover:underline"
            >
              {assignment.title}
            </Link>
            <p className="text-sm text-gray-300">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
            <p className="text-sm text-gray-300">Status: {assignment.status}</p>
            <p className="text-sm text-gray-300">Professor Approval: {assignment.profApproval ? 'Approved' : 'Pending'}</p>
            {assignment.description && <p className="text-sm text-gray-300">Description: {assignment.description}</p>}
            {assignment.gDriveLink && (
              <p className="text-sm">
                <a href={assignment.gDriveLink} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                  Google Drive Link
                </a>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;
