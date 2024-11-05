"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import StudentAssignment from "@/components/studentassignment";

const students = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Charlie Brown" },
  { id: 4, name: "Diana Prince" },
  { id: 5, name: "Ethan Hunt" },
];

const StudentList: React.FC = () => {
  const params = useParams();
  const assignmentId = params.aid as string;
  const courseId = (params.id as string) || "";

  const [approvalStatus, setApprovalStatus] = useState<{ [key: number]: boolean }>({});

  const toggleApproval = (studentId: number) => {
    setApprovalStatus((prevState) => ({
      ...prevState,
      [studentId]: !prevState[studentId],
    }));
  };

  return (
    <div className="p-4 min-h-screen bg-c2">
      <h2 className="text-white text-2xl font-semibold mb-6 text-center">
        Students for Assignment {assignmentId}
      </h2>
      {/* Grid container for responsive layout */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {students.map((student) => (
          <StudentAssignment
            key={student.id}
            studentId={student.id}
            studentName={student.name}
            assignmentId={assignmentId}
            approved={approvalStatus[student.id] || false}
            toggleApproved={() => toggleApproval(student.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
