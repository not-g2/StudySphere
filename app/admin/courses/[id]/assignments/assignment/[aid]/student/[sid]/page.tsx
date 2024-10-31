// assignments/assignment/[aid]/student/[sid]/page.tsx

"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';

const AssignmentPage: React.FC = () => {
  const params = useParams();
  const { aid: assignmentId, sid: studentId } = params;

  const [approved, setApproved] = useState(false);

  const toggleApproved = () => {
    setApproved(!approved);
  };

  return (
    <div className="p-4 min-h-screen bg-c2 flex flex-col items-center">
      <h2 className="text-c4 text-2xl font-semibold mb-6 text-center">Assignment {assignmentId} for Student {studentId}</h2>
      <div className="bg-c3 shadow-md rounded-lg p-6 max-w-md w-full">
        <p className="text-c5 mb-4">
          <strong>Assignment ID:</strong> {assignmentId}
        </p>
        <p className="text-c5 mb-4">
          <strong>Student ID:</strong> {studentId}
        </p>
        <a
          href="https://example.com/assignment-link" // Replace with actual assignment link
          target="_blank"
          rel="noopener noreferrer"
          className="text-c1 hover:underline mb-4 inline-block"
        >
          View Assignment
        </a>
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={approved}
            onChange={toggleApproved}
            className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-c5">Mark as Corrected</label>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
