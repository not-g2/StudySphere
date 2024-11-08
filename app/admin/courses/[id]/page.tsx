"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import GDriveUploadSection from "@/components/gdrive";
import CourseDetails from "@/components/CourseDetails";
import AnnouncementSection from "@/components/AnnouncementSection";
import AssignmentUpload from "@/components/AssignmentUpload";
import CourseLinks from "@/components/CourseLinks";
import Cookies from "js-cookie";

const CoursePage: React.FC = () => {
  const params = useParams();
  const courseId = params.id; // Use course ID from the URL

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Retrieve token from cookies
    const getTokenFromCookies = () => {
      const sessionData = Cookies.get("session");
      if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        setToken(parsedSession.user.token);
      } else {
        console.log("No session cookie found");
      }
    };

    const fetchCourse = async () => {
      if (!token) return;
      try {
        const response = await fetch(`http://localhost:8000/api/courses/getcourse/${courseId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch course details.");
        }

        const data = await response.json();
        setCourse(data.course); // Access the nested "course" object
      } catch (err) {
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getTokenFromCookies();
    fetchCourse();
  }, [courseId, token]);

  if (loading) {
    return <p className="text-center text-white">Loading course details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!course) {
    return <p className="text-center text-gray-700">Course not found.</p>;
  }

  return (
    <div className="bg-c2 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-c5 p-8 rounded shadow-md max-w-lg w-full text-center">
        <CourseDetails course={course} />
        <AnnouncementSection />
        <AssignmentUpload courseId={course._id} />
        <GDriveUploadSection />
        <CourseLinks courseId={course._id} />
      </div>
    </div>
  );
};

export default CoursePage;
