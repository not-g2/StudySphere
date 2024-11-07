"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface Student {
  _id: string;
  name: string;
}

interface AttendancePageProps {
  courseId: string;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ courseId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(courseId);
  useEffect(() => {
    // Fetch students for the specified course
    const fetchStudents = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(`http://localhost:8000/api/courses/${courseId}/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students.");
        }

        const data = await response.json();
        console.log(data);
        setStudents(data.students);
        setAttendance(
          data.students.reduce((acc: { [key: string]: boolean }, student: Student) => {
            acc[student._id] = false;
            return acc;
          }, {})
        );
      } catch (err) {
        setError("Failed to load students. Please try again later.");
        console.error("Error fetching students:", err);
      }
    };

    fetchStudents();
  }, [courseId]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    // Reset attendance for the new date
    setAttendance(
      students.reduce((acc, student) => {
        acc[student._id] = false;
        return acc;
      }, {} as { [key: string]: boolean })
    );
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [studentId]: !prevAttendance[studentId],
    }));
  };

  const handleSubmit = async () => {
    if (!date) {
      alert("Please select a date.");
      return;
    }

    const token = Cookies.get("token");

    setLoading(true);
    setError(null);

    const attendanceData = students.map((student) => ({
      userId: student._id,
      courseId,
      date,
      status: attendance[student._id] ? "present" : "absent",
    }));

    try {
      await Promise.all(
        attendanceData.map(async (record) => {
          const response = await fetch("http://localhost:8000/api/post/mark", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(record),
          });
          if (!response.ok) {
            throw new Error(`Failed to mark attendance for ${record.userId}`);
          }
        })
      );

      alert(`Attendance for ${date} has been recorded!`);
    } catch (err) {
      setError("Failed to submit attendance. Please try again.");
      console.error("Error submitting attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-c2 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4 text-white">Attendance</h2>
      <div className="bg-c5 p-6 rounded shadow-md w-full max-w-md">
        {/* Date Picker */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Attendance List */}
        <ul className="space-y-4">
          {students.map((student) => (
            <li key={student._id} className="flex items-center">
              <input
                type="checkbox"
                checked={attendance[student._id]}
                onChange={() => toggleAttendance(student._id)}
                className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-white">{student.name}</label>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 bg-c1 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Submitting..." : "Submit Attendance"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default AttendancePage;
