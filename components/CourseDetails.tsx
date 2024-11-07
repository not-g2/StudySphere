import React from "react";

type Course = {
  _id: string;
  name: string;
  description: string;
  instructor?: string; // Optional, in case instructor information is not always available
};

const CourseDetails: React.FC<{ course: Course }> = ({ course }) => (
  <>
    <h1 className="text-2xl font-bold mb-2 text-white">{course.name}</h1>
    <p className="mb-4 text-white">{course.description}</p>
    {course.instructor && (
      <p className="text-white">
        <strong>Instructor:</strong> {course.instructor}
      </p>
    )}
  </>
);

export default CourseDetails;
