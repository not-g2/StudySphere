import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg, EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
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
  extendedProps?: {
    day: string;
    slotStartTime: string;
  };
}

const MyCalendar = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [session, setSession] = useState<any>(null);
  const [refresh, setRefresh] = useState<number>(0); // New state to trigger re-fetching

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
              const startTimeFull = `${dayDate}T${slot.startTime}:00`; // Full datetime with seconds
              const endTimeFull = `${dayDate}T${slot.endTime}:00`;

              return {
                title: `${slot.subject} (${slot.activity})`,
                start: startTimeFull,
                end: endTimeFull,
                extendedProps: {
                  day: entry.day, // using the string from the timetable ("Monday", etc.)
                  slotStartTime: slot.startTime, // as stored (e.g., "9:00 AM")
                },
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
  }, [session, refresh]); // Dependency includes refresh so that changes trigger a re-fetch

  // Handler for clicking on a date (if needed)
  const handleDateClick = (arg: DateClickArg) => {
    alert(`Date clicked: ${arg.dateStr}`);
  };

  // Handler to delete a slot when its event is clicked
  const handleEventClick = async (clickInfo: EventClickArg) => {
    const event = clickInfo.event;

    // Retrieve the original day and slot start time from extendedProps
    const day: string = event.extendedProps.day;
    const startTime: string = event.extendedProps.slotStartTime;

    if (!window.confirm(`Are you sure you want to delete the slot: ${event.title}?`)) {
      return;
    }

    try {
      const studentId = session.user?.id;
      if (!studentId) {
        console.error("User ID is missing in session data");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/tt/delete-slot/${studentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, startTime }),
      });

      if (response.ok) {
        // Instead of filtering out the event locally, trigger a re-fetch
        setRefresh(prev => prev + 1);
        alert('Slot deleted successfully.');
      } else {
        console.error('Failed to delete slot. Status:', response.status);
        alert('Failed to delete slot.');
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
      alert('Error deleting slot.');
    }
  };

  return (
    <div className="p-6 bg-c5 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Schedule Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}  // Added event click handler for deletion
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
