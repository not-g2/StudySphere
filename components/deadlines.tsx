import React from 'react';

type Deadline = {
  id: number;
  name: string;
  date: string;
};

function DeadlinesList() {
  const deadlines: Deadline[] = [
    { id: 2, name: "Midterm Exam", date: "2024-11-05" },
    { id: 1, name: "Project Submission", date: "2024-11-10" },
    { id: 3, name: "Final Presentation", date: "2024-12-01" }
  ];

  return (
    <div>
      <h2>Upcoming Deadlines</h2>
      <ul>
        {deadlines.map((deadline) => (
          <li key={deadline.id}>
            {deadline.name}: {new Date(deadline.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeadlinesList;
