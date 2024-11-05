// assignments/page.tsx

"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const assignments = [
  { id: 1, title: 'Math Homework 1' },
  { id: 2, title: 'Science Project' },
  { id: 3, title: 'English Essay' },
];

const AssignmentList: React.FC = () => {
  const params = useParams();
  const courseId = params.id; // Retrieve the course ID from the URL

  return (
    <div className="p-4 min-h-screen bg-c2">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">Assignments</h2>
      <ul className="max-w-md mx-auto space-y-4">
        {assignments.map((assignment) => (
          <li key={assignment.id} className="bg-c5 shadow-md rounded-lg p-4">
            {/* Include the courseId in the link path */}
            <Link href={`/admin/courses/${courseId}/assignments/assignment/${assignment.id}`} className="text-white hover:underline">
              {assignment.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;
