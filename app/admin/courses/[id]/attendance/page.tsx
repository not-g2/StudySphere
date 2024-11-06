// app/attendance/page.tsx

"use client";

import React, { useState } from 'react';

const AttendancePage: React.FC = () => {
  // Placeholder list of names
  const [students] = useState<string[]>([
    'Alice Johnson',
    'Bob Smith',
    'Charlie Brown',
    'Diana Prince',
    'Ethan Hunt',
  ]);

  // State to track attendance and selected date
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>(
    students.reduce((acc, student) => {
      acc[student] = false;
      return acc;
    }, {} as { [key: string]: boolean })
  );
  const [date, setDate] = useState<string>('');

  // Handle date change and reset attendance
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    // Reset attendance for the new date
    setAttendance(
      students.reduce((acc, student) => {
        acc[student] = false;
        return acc;
      }, {} as { [key: string]: boolean })
    );
  };

  // Toggle attendance status for a student
  const toggleAttendance = (student: string) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [student]: !prevAttendance[student],
    }));
  };

  // Handle submit button click
  const handleSubmit = () => {
    console.log("Attendance for:", date);
    console.log(attendance);
    alert(`Attendance for ${date} has been recorded!`);
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
            <li key={student} className="flex items-center">
              <input
                type="checkbox"
                checked={attendance[student]}
                onChange={() => toggleAttendance(student)}
                className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-white">{student}</label>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 bg-c1 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Submit Attendance
      </button>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-white">Summary for {date || "Selected Date"}</h3>
        <p className="text-gray-400">
          {Object.values(attendance).filter(Boolean).length} of {students.length} present
        </p>
      </div>
    </div>
  );
};

export default AttendancePage;
