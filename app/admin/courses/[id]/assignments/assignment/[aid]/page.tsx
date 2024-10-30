// assignments/assignment/[aid]/page.tsx

"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const students = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
  { id: 3, name: 'Charlie Brown' },
];

const StudentList: React.FC = () => {
  const params = useParams();
  const assignmentId = params.aid;
  const courseId = params.id; // Retrieve the course ID from the URL

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-center">Students for Assignment {assignmentId}</h2>
      <ul className="max-w-md mx-auto space-y-4">
        {students.map((student) => (
          <li key={student.id} className="bg-white shadow-md rounded-lg p-4">
            {/* Include courseId and assignmentId in the link path */}
            <Link href={`/admin/courses/${courseId}/assignments/assignment/${assignmentId}/student/${student.id}`} className="text-blue-600 hover:underline">
              {student.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
