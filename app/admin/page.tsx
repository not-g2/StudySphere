"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Course = {
  id: number;
  title: string;
  description: string;
  instructor: string;
};

const MyCourses: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    // Only fetch courses if the email is available
    if (!email) {
      setLoading(false); // Stop loading if email is not available
      return;
    }

    // Define the async function to fetch courses
    const fetchCourses = async () => {
      try {
        const response = await fetch(`localhost:8000/api/assgn/course/672a0ddcbddb3f6f6c16ee48`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch courses.");
        }

        const data = await response.json();
        setCourses(data.courses);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [email]);

  const handleCourseClick = (id: number) => {
    router.push(`/admin/courses/${id}`);
  };

  return (
    <div className="p-4 min-h-screen bg-c2">
      <h2 className="text-2xl font-semibold mb-4 text-center text-white">
        Your Courses
      </h2>
      
      {loading ? (
        <p className="text-center text-white">Loading courses...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              className="bg-c5 rounded-lg shadow-md p-6 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <h3 className="text-xl font-bold text-white">
                  {course.title}
                </h3>
                <p className="text-white mt-2">{course.description}</p>
              </div>
              <p className="mt-4 text-white">
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
