import React from "react";
import Link from "next/link";

const CourseLinks: React.FC<{ courseId: number }> = ({ courseId }) => (
  <div className="mt-8 space-y-4">
    <Link href={`/admin/courses/${courseId}/assignments`}>
      <button className="w-full bg-t2 text-white py-2 px-4 rounded hover:bg-opacity-80 transition">
        View All Assignments
      </button>
    </Link>
    <Link href={`/admin/courses/${courseId}/attendance`}>
      <button className="w-full bg-t2 text-white py-2 px-4 rounded hover:bg-opacity-80 transition">
        Attendance
      </button>
    </Link>
  </div>
);

export default CourseLinks;
