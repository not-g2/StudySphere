// app/courses_admin/[id]/page.tsx

"use client";

import React, { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type Course = {
  id: number;
  title: string;
  description: string;
  instructor: string;
};

// Placeholder data for courses
const courses: Course[] = [
  { id: 1, title: 'Math 101', description: 'An introduction to mathematics.', instructor: 'John Doe' },
  { id: 2, title: 'Physics 101', description: 'Basic concepts of physics.', instructor: 'Jane Smith' },
  { id: 3, title: 'Chemistry 101', description: 'Fundamentals of chemistry.', instructor: 'Albert Brown' },
];

const CoursePage: React.FC = () => {
  const params = useParams();
  const id = params.id; // Get the course ID from the URL
  const course = courses.find((course) => course.id === Number(id));

  const [announcement, setAnnouncement] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Create a ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!course) {
    return <p>Course not found</p>;
  }

  const handleAnnouncementChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnnouncement(e.target.value);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const postAnnouncement = () => {
    console.log("Posted announcement:", announcement);
    alert(`Announcement posted: ${announcement}`);
    setAnnouncement(''); // Clear the announcement field
  };

  const submitAssignment = () => {
    console.log("Submitted file:", selectedFile ? selectedFile.name : "No file selected");
    console.log("Due Date:", dueDate);
    alert("Assignment submitted: " + (selectedFile ? selectedFile.name : "No file selected") + "\nDue Date: " + dueDate);
    setSelectedFile(null); // Clear the file selection
    setDueDate(''); // Clear the due date
  };

  // Trigger the file input programmatically
  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-c2 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-c3 p-8 rounded shadow-md max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-2 text-c1">{course.title}</h1>
        <p className="mb-4 text-c1">{course.description}</p>
        <p className="text-c1"><strong>Instructor:</strong> {course.instructor}</p>

        {/* Announcement Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Make an Announcement</h2>
          <textarea
            value={announcement}
            onChange={handleAnnouncementChange}
            placeholder="Write an announcement..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-c1 placeholder-c1"
          ></textarea>
          <button
            onClick={postAnnouncement}
            className="w-full bg-c4 text-c1 py-2 px-4 rounded hover:bg-opacity-80 transition"
          >
            Post Announcement
          </button>
        </div>

        {/* Assignment Upload Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Upload Assignment</h2>
          {/* Hidden native file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          {/* Custom button to trigger file input */}
          <button
            type="button"
            onClick={handleChooseFileClick}
            className="w-full bg-c4 text-white py-2 px-4 rounded mb-4 hover:bg-opacity-80 transition"
          >
            {selectedFile ? selectedFile.name : "Choose File"}
          </button>
          
          {/* Due Date Input */}
          <input
            type="date"
            value={dueDate}
            onChange={handleDueDateChange}
            className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-c1 placeholder-c1"
            placeholder="Select due date"
          />
          
          <button
            onClick={submitAssignment}
            className="w-full bg-c4 text-white py-2 px-4 rounded hover:bg-opacity-80 transition"
          >
            Submit Assignment
          </button>
        </div>

        {/* Link to All Assignments */}
        <div className="mt-8">
          <Link href={`/admin/courses/${id}/assignments`}>
            <button className="w-full bg-c4 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              View All Assignments
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
