"use client"

import React from 'react';
import { useParams } from 'next/navigation';

type Course = {
  id: number;
  title: string;
  description: string;
  instructor: string;
};

// Placeholder data
const courses: Course[] = [
  { id: 1, title: 'Math 101', description: 'An introduction to mathematics.', instructor: 'John Doe' },
  { id: 2, title: 'Physics 101', description: 'Basic concepts of physics.', instructor: 'Jane Smith' },
  { id: 3, title: 'Chemistry 101', description: 'Fundamentals of chemistry.', instructor: 'Albert Brown' },
];

const CoursePage = () => {
  const params = useParams();
  const id = params.id; // the id is obtained from the url

  const course = courses.find((course) => course.id === Number(id));

  if (!course) {
    return <p>Course not found</p>;
  }

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p><strong>Instructor:</strong> {course.instructor}</p>
    </div>
  );
};

export default CoursePage;
