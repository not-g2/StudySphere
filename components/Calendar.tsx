import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventClickArg, EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import Cookies from "js-cookie";
import "../app/(protected)/output.css";

// Ensures timetable events are shown only for the current week
const getDateForDay = (day: string) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const currentDayIndex = today.getDay();
  const targetDayIndex = daysOfWeek.indexOf(day);

  const diff = (targetDayIndex - currentDayIndex + 7) % 7;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);

  return targetDate.toISOString().split("T")[0]; // Returns 'YYYY-MM-DD'
};

interface EventData {
  title: string;
  start: string;
  end: string;
  extendedProps?: {
    day: string;
    slotStartTime: string;
    type?: string;
    description?: string;
  };
}

const MyCalendar = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [session, setSession] = useState<any>(null);
  const [refresh, setRefresh] = useState<number>(0);

  // Fetch user session from cookies
  useEffect(() => {
    const fetchSession = () => {
      const sessionData = Cookies.get("session");
      if (sessionData) {
        setSession(JSON.parse(sessionData));
      } else {
        console.error("No session data found in cookies");
      }
    };
    fetchSession();
  }, []);

  // Fetch timetable and reminders
  useEffect(() => {
    if (!session) return;
    const userId = session.user?.id;
    if (!userId) {
      console.error("User ID is missing in session data");
      return;
    }

    const fetchTimetable = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/tt/timetable/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          const formattedEvents = data.timetable.flatMap((entry: any) => {
            const dayDate = getDateForDay(entry.day);
            return entry.slots.map((slot: any) => ({
              title: `${slot.subject} (${slot.activity})`,
              start: `${dayDate}T${slot.startTime}:00`,
              end: `${dayDate}T${slot.endTime}:00`,
              extendedProps: {
                day: entry.day,
                slotStartTime: slot.startTime,
                type: "timetable",
              },
            }));
          });
          setEvents((prev) => [...prev, ...formattedEvents]);
        } else {
          console.error("Failed to fetch timetable:", response.status);
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
      }
    };

    const fetchReminders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/reminder/reminders/${userId}`
        );
        if (response.ok) {
          const reminders = await response.json();
          const formattedReminders = reminders.map((reminder: any) => ({
            title: `${reminder.name}`,
            start: reminder.startdate,
            end: new Date(
              new Date(reminder.enddate).getTime() + 86400000
            )
              .toISOString()
              .split("T")[0], // Ensure full-day stretch
            allDay: true,
            extendedProps: {
              description: reminder.description,
              type: "reminder",
            },
          }));
          setEvents((prev) => [...prev, ...formattedReminders]);
        } else {
          console.error("Failed to fetch reminders:", response.status);
        }
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };

    // Reset events before re-fetching to avoid duplicates
    setEvents([]);
    fetchTimetable();
    fetchReminders();
  }, [session, refresh]);

  // Handle event clicks (for deletion or viewing details)
  const handleEventClick = async (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const eventType = event.extendedProps.type;

    if (eventType === "timetable") {
      const day: string = event.extendedProps.day;
      const startTime: string = event.extendedProps.slotStartTime;

      if (
        !window.confirm(
          `Are you sure you want to delete this slot: ${event.title}?`
        )
      )
        return;

      try {
        const studentId = session.user?.id;
        if (!studentId) {
          console.error("User ID is missing in session data");
          return;
        }

        const response = await fetch(
          `http://localhost:8000/api/tt/delete-slot/${studentId}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day, startTime }),
          }
        );

        if (response.ok) {
          setRefresh((prev) => prev + 1);
          alert("Slot deleted successfully.");
        } else {
          console.error("Failed to delete slot:", response.status);
          alert("Failed to delete slot.");
        }
      } catch (error) {
        console.error("Error deleting slot:", error);
        alert("Error deleting slot.");
      }
    } else if (eventType === "reminder") {
      alert(
        `Reminder: ${event.title}\nDescription: ${event.extendedProps.description}`
      );
    }
  };

  return (
    <div className="p-6 bg-c5 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Schedule Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        selectable={true}
        editable={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
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