import React from "react";

type Course = {
  id: number;
  title: string;
  description: string;
  instructor: string;
};

const CourseDetails: React.FC<{ course: Course }> = ({ course }) => (
  <>
    <h1 className="text-2xl font-bold mb-2 text-white">{course.title}</h1>
    <p className="mb-4 text-white">{course.description}</p>
    <p className="text-white">
      <strong>Instructor:</strong> {course.instructor}
    </p>
  </>
);

export default CourseDetails;
