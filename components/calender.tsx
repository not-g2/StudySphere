"use client";

import React from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

// Placeholder events
const events: Event[] = [
  {
    title: 'Midterm Exam',
    allDay: true,
    start: new Date(2024, 10, 5), // Month is 0-indexed, so 10 is November
    end: new Date(2024, 10, 5),
  },
  {
    title: 'Project Submission',
    allDay: true,
    start: new Date(2024, 10, 10),
    end: new Date(2024, 10, 10),
  },
  {
    title: 'Final Presentation',
    allDay: true,
    start: new Date(2024, 11, 1), 
    end: new Date(2024, 11, 1),
  },
];

function CalendarComponent() {
  return (
    <div className="p-4 bg-white border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['month']}
        className="bg-white text-gray-700"
      />
    </div>
  );
}

export default CalendarComponent;
