"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Submission {
  _id: string;
  assignmentId: string;
  fileLink: string;
  status: string;
  studentId: {
    _id: string;
    name: string;
  };
  submissionDate: string;
  submittedDate: string;
}

const StudentList: React.FC = () => {
  const params = useParams();
  const assignmentId = params.aid as string;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch submissions for the assignment
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/submissions/assignment/${assignmentId}/submissions`
        );

        if (!response.ok) {
          throw new Error("Failed to load submissions.");
        }

        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        setError("Failed to load submissions.");
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  // Toggle approval status for a submission
  const toggleApproval = async (submissionId: string) => {
    // Find the specific submission by its ID
    const submission = submissions.find((sub) => sub._id === submissionId);
    if (!submission) {
      setError("Submission not found.");
      return;
    }

    const studentId = submission.studentId._id;

    try {
      const response = await fetch(`http://localhost:8000/api/submissions/submission/${submissionId}/feedback`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentId,
          assignmentId: assignmentId,
          feedback: "",
        }),
      });

      if (!response.ok) {
        throw new Error("Error updating approval status");
      }

      // Toggle between "approved" and "pending" or "graded" based on the current status
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) =>
          submission._id === submissionId
            ? {
                ...submission,
                status: submission.status === "approved" || submission.status === "graded" ? "pending" : "approved",
              }
            : submission
        )
      );
    } catch (err) {
      console.error("Error updating approval status:", err);
      setError("Error approving submission. Please try again.");
    }
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="p-4 min-h-screen bg-c2">
      <h2 className="text-white text-2xl font-semibold mb-6 text-center">
        Student Submissions for Assignment {assignmentId}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {submissions.map((submission) => (
          <li key={submission._id} className="bg-c5 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">{submission.studentId.name}</span>
              <input
                type="checkbox"
                checked={submission.status === "approved" || submission.status === "graded"}
                onChange={() => toggleApproval(submission._id)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </div>
            <p className="text-sm text-gray-300 mb-2">
              Submitted Date: {new Date(submission.submittedDate).toLocaleString()}
            </p>
            <p className="text-sm text-gray-300 mb-2">Status: {submission.status}</p>
            <p className="text-sm text-gray-300">
              <a
                href={submission.fileLink}
                className="text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Submission
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
