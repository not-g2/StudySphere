import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventContentArg } from '@fullcalendar/core';
import Cookies from "js-cookie";
import '../app/output.css';

// Helper to get the date of a specific day in the current week
const getDateForDay = (day: string) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date();
  const currentDayIndex = today.getDay();
  const targetDayIndex = daysOfWeek.indexOf(day);

  const diff = (targetDayIndex - currentDayIndex + 7) % 7;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);

  return targetDate.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
};

interface EventData {
  title: string;
  start: string;
  end: string;
}

const MyCalendar = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = () => {
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
    const fetchTimetable = async () => {
      if (!session) return;

      const userId = session.user?.id;
      if (!userId) {
        console.error("User ID is missing in session data");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/tt/timetable/${userId}`);
        if (response.ok) {
          const data = await response.json();

          // Transform timetable data to FullCalendar event format
          const formattedEvents = data.timetable.flatMap((entry: any) => {
            const dayDate = getDateForDay(entry.day); // Convert day name to 'YYYY-MM-DD'
            
            return entry.slots.map((slot: any) => {
              const startTime = `${dayDate}T${slot.startTime}:00`; // Full datetime with seconds
              const endTime = `${dayDate}T${slot.endTime}:00`;

              return {
                title: `${slot.subject} (${slot.activity})`,
                start: startTime,
                end: endTime,
              };
            });
          });

          setEvents(formattedEvents);
        } else {
          console.error('Failed to fetch timetable. Response status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching timetable:', error);
      }
    };

    fetchTimetable();
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
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
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
