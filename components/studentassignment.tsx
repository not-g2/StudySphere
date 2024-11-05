import React from "react";

interface StudentAssignmentProps {
  studentId: number;
  studentName: string;
  assignmentId: string;
  approved: boolean; // Add approved prop
  toggleApproved: () => void; // Add toggleApproved prop
}

const StudentAssignment: React.FC<StudentAssignmentProps> = ({
  studentId,
  studentName,
  assignmentId,
  approved,
  toggleApproved,
}) => {
  return (
    <li className="bg-c5 shadow-md rounded-lg p-4">
      <h3 className="text-white font-semibold mb-2">{studentName}</h3>
      <p className="text-white mb-2">
        <strong>Assignment ID:</strong> {assignmentId}
      </p>
      <p className="text-white mb-2">
        <strong>Student ID:</strong> {studentId}
      </p>
      <a
        href="https://example.com/assignment-link"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:underline mb-4 inline-block"
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
        <label className="text-white">Mark as Corrected</label>
      </div>
    </li>
  );
};

export default StudentAssignment;
