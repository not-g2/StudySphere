"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import DueDateModal from "@/components/DueDateModal"; // Adjust the path as necessary

type Assignment = {
  _id: string;
  title: string;
  description?: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  createdAt: string;
  profApproval: boolean;
  createdBy: string;
  pdfLink?: string;
};

const AssignmentList: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [session, setSession] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const params = useParams();
  const courseId = params.courseId || params.id;
  const router = useRouter();
  useEffect(() => {
    // Fetch session from cookies and extract the token
    const sessionData: string | undefined = Cookies.get("session");

    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      setSession(parsedSession);
      setToken(parsedSession?.user?.token); // Fetch the token from parsed session
    } else {
      router.push("/auth/signin"); // Redirect if session is missing
    }
  }, [router]);

  useEffect(() => {
    if (!token || !courseId) {
      setLoading(false);
      return;
    }
    console.log(token);

    const fetchAssignments = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/assgn/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: "GET",
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to fetch assignments");
        }

        const data = await response.json();
        setAssignments(Array.isArray(data) ? data : data.assignments || []);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [session, courseId]);

  const handleUpdateDueDate = async (id: string, newDate: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/assgn/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dueDate: newDate }),
      });

      if (!response.ok) {
        throw new Error("Failed to update due date.");
      }

      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment._id === id ? { ...assignment, dueDate: newDate } : assignment
        )
      );
      alert("Due date updated successfully.");
    } catch (error) {
      console.error("Error updating due date:", error);
      alert("There was an error updating the due date. Please try again.");
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this assignment?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/assgn/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete assignment.");
      }

      setAssignments((prev) => prev.filter((assignment) => assignment._id !== id));
      alert("Assignment deleted successfully.");
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("There was an error deleting the assignment. Please try again.");
    }
  };

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
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={() => setSelectedAssignment(assignment)}
                className="text-sm bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition"
              >
                Update Due Date
              </button>
              <button
                onClick={() => handleDeleteAssignment(assignment._id)}
                className="text-sm bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
            <Link
              href={`/admin/courses/${assignment.course}/assignments/assignment/${assignment._id}`}
              className="text-white hover:underline"
            >
              {assignment.title}
            </Link>
            <p className="text-sm text-gray-300">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </p>
            {assignment.description && (
              <p className="text-sm text-gray-300">Description: {assignment.description}</p>
            )}
            {assignment.pdfLink && (
              <p className="text-sm">
                <a
                  href={assignment.pdfLink}
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PDF Link
                </a>
              </p>
            )}
          </li>
        ))}
      </ul>

      {selectedAssignment && (
        <DueDateModal
          assignmentTitle={selectedAssignment.title}
          onClose={() => setSelectedAssignment(null)}
          onUpdateDueDate={(newDate) => handleUpdateDueDate(selectedAssignment._id, newDate)}
        />
      )}
    </div>
  );
};

export default AssignmentList;
