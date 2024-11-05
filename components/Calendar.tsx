import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import '../app/output.css'; // Import your Tailwind CSS file

const MyCalendar = () => {
  const [events, setEvents] = useState([
    {
      title: 'Long Meeting with Team Over Multiple Topics',
      start: '2024-11-01T10:00:00',
      end: '2024-11-01T11:30:00',
    },
    {
      title: 'Project Deadline Final Phase and Follow-Up',
      start: '2024-11-05T12:00:00',
      end: '2024-11-05T13:00:00',
    },
  ]);

  const handleDateClick = (arg: DateClickArg) => {
    alert(`Date clicked: ${arg.dateStr}`);
  };

  return (
    <div className="p-6 bg-c5 rounded-lg shadow-lg ">
      <h1 className="text-2xl font-bold text-white mb-4">Schedule Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        selectable={true}
        editable={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '', // Removes the "Month" button
        }}
        height="auto"
        dayMaxEvents={true}
        eventContent={(eventInfo) => (
          <div className="whitespace-normal break-words text-white">
            {eventInfo.event.title}
          </div>
        )}
      />

    </div>
  );
};

export default MyCalendar;
