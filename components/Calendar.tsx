"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventClickArg, EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Cookies from "js-cookie";
import SubjectSchedulerModal from "@/components/timetable";
import "../app/(protected)/output.css";

// Helper to map a weekday name to this week’s date (YYYY-MM-DD)
const getDateForDay = (day: string): string => {
  const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
  ];
  const today = new Date();
  const diff = (daysOfWeek.indexOf(day) - today.getDay() + 7) % 7;
  const target = new Date(today);
  target.setDate(today.getDate() + diff);
  return target.toISOString().split("T")[0];
};

interface EventData {
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  extendedProps?: {
    type?: string;
    // for timetable slots:
    day?: string;
    slotStartTime?: string;
    // for reminders:
    id?: string;
  };
}

interface MyCalendarProps {
  refreshTrigger: number;
}

const MyCalendar: React.FC<MyCalendarProps> = ({ refreshTrigger }) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [session, setSession] = useState<any>(null);
  const [refresh, setRefresh] = useState<number>(0);
  const [openScheduler, setOpenScheduler] = useState<boolean>(false);

  // 1) Load user session from cookie on mount
  useEffect(() => {
    const raw = Cookies.get("session");
    if (raw) {
      setSession(JSON.parse(raw));
    } else {
      console.error("No session data found in cookies");
    }
  }, []);

  // 2) Fetch timetable, reminders, deadlines whenever session, local refresh, or reminder refresh changes
  useEffect(() => {
    if (!session) return;
    const userId = session.user.id;

    // Clear out old events
    setEvents([]);

    // --- Timetable slots ---
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/tt/timetable/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const slots: EventData[] = data.timetable.flatMap((entry: any) => {
            const date = getDateForDay(entry.day);
            return entry.slots.map((slot: any) => ({
              title: `${slot.subject} (${slot.activity})`,
              start: `${date}T${slot.startTime}:00`,
              end: `${date}T${slot.endTime}:00`,
              extendedProps: {
                type: "timetable",
                day: entry.day,
                slotStartTime: slot.startTime,
              },
            }));
          });
          setEvents((prev) => [...prev, ...slots]);
        } else {
          console.error("Failed to fetch timetable:", res.status);
        }
      } catch (err) {
        console.error("Error fetching timetable:", err);
      }
    })();

    // --- Reminders ---
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/reminder/reminders/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );
        if (res.ok) {
          const reminders = await res.json();
          const evs: EventData[] = reminders.map((r: any) => ({
            title: r.description,
            start: r.startdate,
            end: new Date(
              new Date(r.enddate).getTime() + 86400000
            )
              .toISOString()
              .split("T")[0],
            allDay: true,
            extendedProps: {
              type: "reminder",
              id: r._id,
            },
          }));
          setEvents((prev) => [...prev, ...evs]);
        } else {
          console.error("Failed to fetch reminders:", res.status);
        }
      } catch (err) {
        console.error("Error fetching reminders:", err);
      }
    })();

    // --- Deadlines ---
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/users/${userId}/deadlines`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const evs: EventData[] = data.deadlines.map((d: any) => ({
            title: `Deadline: ${d.assignmentTitle}`,
            start: d.dueDate,
            allDay: true,
            extendedProps: { type: "deadline" },
          }));
          setEvents((prev) => [...prev, ...evs]);
        } else {
          console.error("Failed to fetch deadlines:", res.status);
        }
      } catch (err) {
        console.error("Error fetching deadlines:", err);
      }
    })();
  }, [session, refresh, refreshTrigger]);

  // 3) Handle event clicks (delete flows + alerts)
  const handleEventClick = async (info: EventClickArg) => {
    const evt = info.event;
    const props = evt.extendedProps as any;

    // --- Delete timetable slot ---
    if (props.type === "timetable") {
      if (!confirm(`Delete slot "${evt.title}"?`)) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/tt/delete-slot/${session.user.id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              day: props.day,
              startTime: props.slotStartTime,
            }),
          }
        );
        if (res.ok) {
          setRefresh((n) => n + 1);
        } else {
          alert("Failed to delete slot.");
        }
      } catch (err) {
        console.error("Error deleting slot:", err);
        alert("Error deleting slot.");
      }
      return;
    }

    // --- Delete reminder ---
    if (props.type === "reminder") {
      if (!confirm(`Delete reminder: "${evt.title}"?`)) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/reminder/delreminder/${props.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );
        if (res.ok) {
          setRefresh((n) => n + 1);
        } else {
          alert("Failed to delete reminder.");
        }
      } catch (err) {
        console.error("Error deleting reminder:", err);
        alert("Error deleting reminder.");
      }
      return;
    }

    // --- Click a deadline ---
    if (props.type === "deadline") {
      alert(`Deadline: ${evt.title}`);
      return;
    }
  };

  // 4) When "Add Schedule" modal submits, re-fetch
  const handleModalSubmit = (schedule: any) => {
    console.log("New schedule:", schedule);
    setOpenScheduler(false);
    setRefresh((n) => n + 1);
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        {/* Global style overrides */}
        <style jsx global>{`
          .fc .fc-daygrid-day-frame {
            background-color: white !important;
            border: 1px solid black !important;
          }
          .fc .fc-daygrid-day-number {
            color: black !important;
          }
          .fc .fc-event {
            color: black !important;
          }
          .fc .fc-toolbar-title {
            color: black !important;
          }
        `}</style>

        <h1 className="text-2xl font-bold text-black mb-4">
          Schedule Calendar
        </h1>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          selectable
          editable
          customButtons={{
            addSchedule: {
              text: "+",
              click: () => setOpenScheduler(true),
            },
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "addSchedule dayGridMonth,dayGridWeek,dayGridDay",
          }}
          height="auto"
          dayMaxEvents
          eventContent={(ev: EventContentArg) => (
            <div className="whitespace-normal break-words text-black">
              {ev.event.title}
            </div>
          )}
        />
      </div>

      {openScheduler && (
        <SubjectSchedulerModal
          onScheduleSubmit={handleModalSubmit}
          onClose={() => setOpenScheduler(false)}
        />
      )}
    </>
  );
};

export default MyCalendar;
