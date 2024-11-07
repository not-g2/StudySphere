"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type Course = {
    _id: string;
    name: string;
    description: string;
    instructor: string;
};

const MyCourses: React.FC = () => {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [session, setSession] = useState<any>(null);

    const [newCourseName, setNewCourseName] = useState("");
    const [newCourseDescription, setNewCourseDescription] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        const sessionData: string | undefined = Cookies.get("session");

        if (sessionData && !session) {
            setSession(JSON.parse(sessionData));
        } else if (!sessionData) {
            router.push("/auth/signin");
        }

        if (session) {
            const token = session.user.token;

            const fetchCourses = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:8000/api/courses/${session.user.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            method: "GET",
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to fetch courses.");
                    }

                    const data = await response.json();
                    setCourses(data.coursesList || []);
                } catch (err) {
                    setError("Failed to load courses. Please try again later.");
                } finally {
                    setLoading(false);
                }
            };

            fetchCourses();
        }
    }, [session]);

    const handleCourseClick = (id: string) => {
        router.push(`/admin/courses/${id}`);
    };

    const handleAddCourse = async () => {
      if (!session) {
          alert("You are not authorized.");
          return;
      }
  
      setFormLoading(true);
      setFormError(null);
  
      try {
          const adminId = session.user.id; // Ensure adminId is available in session
          const response = await fetch(
              `http://localhost:8000/api/courses/create/${adminId}`, // Include adminId in the URL
              {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${session.user.token}`,
                  },
                  body: JSON.stringify({
                      name: newCourseName,
                      description: newCourseDescription,
                      students: [],
                  }),
              }
          );
  
          if (!response.ok) {
              throw new Error("Failed to add course.");
          }
  
          const newCourse = await response.json();
          setCourses((prevCourses) => [...prevCourses, newCourse.course]);
          setNewCourseName("");
          setNewCourseDescription("");
          setShowForm(false);
      } catch (err) {
          setFormError("Failed to add course. Please try again.");
          console.error("Error adding course:", err);
      } finally {
          setFormLoading(false);
      }
  };
  
  

    return (
        <div className="p-4 min-h-screen bg-c2">
            <h2 className="text-2xl font-semibold mb-4 text-center text-white">
                Your Courses
            </h2>

            <button
                onClick={() => setShowForm(true)}
                className="mb-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
                Add New Course
            </button>

            {showForm && (
                <div className="bg-c5 p-4 rounded shadow-md mb-6">
                    <h3 className="text-lg font-semibold text-white">
                        New Course Details
                    </h3>
                    <input
                        type="text"
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        placeholder="Course Name"
                        className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-white"
                    />
                    <textarea
                        value={newCourseDescription}
                        onChange={(e) =>
                            setNewCourseDescription(e.target.value)
                        }
                        placeholder="Course Description"
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-white"
                    ></textarea>
                    <button
                        onClick={handleAddCourse}
                        disabled={formLoading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                    >
                        {formLoading ? "Adding..." : "Submit Course"}
                    </button>
                    {formError && (
                        <p className="text-red-500 mt-2">{formError}</p>
                    )}
                </div>
            )}

            {loading ? (
                <p className="text-center text-white">Loading courses...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : courses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course, index) => (
                        <div
                            key={course._id || index} // Use index as a fallback if _id is missing
                            onClick={() => handleCourseClick(course._id)}
                            className="bg-c5 rounded-lg shadow-md p-6 flex flex-col justify-between cursor-pointer"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    {course.name}
                                </h3>
                                <p className="text-white mt-2">
                                    {course.description}
                                </p>
                            </div>
                            {course.instructor && (
                                <p className="mt-4 text-white">
                                    <strong>Instructor:</strong>{" "}
                                    {course.instructor}
                                </p>
                            )}
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
