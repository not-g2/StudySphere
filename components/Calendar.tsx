import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventContentArg } from '@fullcalendar/core';
import Cookies from "js-cookie";
import '../app/output.css'; // Import your Tailwind CSS file

// Define a type for the event data
interface EventData {
  title: string;
  start: string;
  end: string;
}

const MyCalendar = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = Cookies.get("session");
      if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        setSession(parsedSession);
      } else {
        console.error("No session data found in cookies");
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchDeadlines = async () => {
      if (!session) {
        return;
      }

      const userId = session.user?.id;
      if (!userId) {
        console.error("User ID is missing in session data");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}/deadlines`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);

          // Format the data to match FullCalendar's requirements
          const formattedEvents = data.deadlines.map((deadline: any) => ({
            title: `${deadline.assignmentTitle} - ${deadline.courseName}`,
            start: new Date(deadline.dueDate).toISOString().split('T')[0], // Format as YYYY-MM-DD
            end: new Date(deadline.dueDate).toISOString().split('T')[0],   // Same format
          }));

          setEvents(formattedEvents);
        } else {
          console.error('Failed to fetch deadlines. Response status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching deadlines:', error);
      }
    };

    fetchDeadlines();
  }, [session]);

  const handleDateClick = (arg: DateClickArg) => {
    alert(`Date clicked: ${arg.dateStr}`);
  };

  return (
    <div className="p-6 bg-c5 rounded-lg shadow-lg">
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
          right: 'dayGridMonth,dayGridWeek,dayGridDay', // Add weekly and daily views
        }}
        height="auto"
        dayMaxEvents={true}
        eventContent={(eventInfo: EventContentArg) => (
          <div className="whitespace-normal break-words text-white">
            {eventInfo.event.title}
          </div>
        )}
      />
    </div>
  );
};

export default MyCalendar;
