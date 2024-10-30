// Add "use client" directive at the top to make this a client component
"use client";

import React, { useState } from 'react';

type Course = {
  id: number;
  title: string;
  description: string;
  instructor: string;
};

const MyCourses: React.FC = () => {
  // Use placeholder data directly as the initial state
  const [courses] = useState<Course[]>([
    { id: 1, title: 'Math 101', description: 'An introduction to mathematics.', instructor: 'John Doe' },
    { id: 2, title: 'Physics 101', description: 'Basic concepts of physics.', instructor: 'Jane Smith' },
    { id: 3, title: 'Chemistry 101', description: 'Fundamentals of chemistry.', instructor: 'Albert Brown' },
  ]);

  return (
    <div>
      <h2>Your Created Courses</h2>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p><strong>Instructor:</strong> {course.instructor}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't created any courses yet.</p>
      )}
    </div>
  );
};

export default MyCourses;
