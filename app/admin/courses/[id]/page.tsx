"use client";

import React, { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import GDriveUploadSection from "../../../../components/gdrive";
import { useSession } from "next-auth/react";
import CourseDetails from "@/components/CourseDetails";
import AnnouncementSection from "@/components/AnnouncementSection";
import AssignmentUpload from "@/components/AssignmentUpload";
import CourseLinks from "@/components/CourseLinks";

const CoursePage: React.FC = () => {
  const { data: session } = useSession();
  const params = useParams();
  const id = params.id; // Get the course ID from the URL

  const courses = [
    { id: 1, title: "Math 101", description: "An introduction to mathematics.", instructor: "John Doe" },
    { id: 2, title: "Physics 101", description: "Basic concepts of physics.", instructor: "Jane Smith" },
    { id: 3, title: "Chemistry 101", description: "Fundamentals of chemistry.", instructor: "Albert Brown" },
  ];

  const course = courses.find((course) => course.id === Number(id));

  if (!course) {
    return <p>Course not found</p>;
  }

  return (
    <div className="bg-c2 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-c5 p-8 rounded shadow-md max-w-lg w-full text-center">
        <CourseDetails course={course} />
        <AnnouncementSection />
        <AssignmentUpload courseId={course.id} token={session?.accessToken} />
        <GDriveUploadSection />
        <CourseLinks courseId={id} />
      </div>
    </div>
  );
};

export default CoursePage;
