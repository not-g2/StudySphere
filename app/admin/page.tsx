// app/components/MyCourses.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Course = {
  id: number;
  title: string;
  description: string;
  instructor: string;
};

const MyCourses: React.FC = () => {
  const router = useRouter();

  // Placeholder courses
  const [courses] = useState<Course[]>([
    {
      id: 1,
      title: "Math 101",
      description: "An introduction to mathematics.",
      instructor: "John Doe",
    },
    {
      id: 2,
      title: "Physics 101",
      description: "Basic concepts of physics.",
      instructor: "Jane Smith",
    },
    {
      id: 3,
      title: "Chemistry 101",
      description: "Fundamentals of chemistry.",
      instructor: "Albert Brown",
    },
  ]);

  const handleCourseClick = (id: number) => {
    router.push(`/Admin/courses/${id}`);
  };

  return (
    <div className="p-4 min-h-screen bg-c2">
      <h2 className="text-2xl font-semibold mb-4 text-center text-c5">
        Your Courses
      </h2>
      {courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              className="bg-c4 rounded-lg shadow-md p-6 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {course.title}
                </h3>
                <p className="text-c5 mt-2">{course.description}</p>
              </div>
              <p className="mt-4 text-c5">
                <strong>Instructor:</strong> {course.instructor}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">
          You haven't created any courses yet.
        </p>
      )}
    </div>
  );
};

export default MyCourses;
