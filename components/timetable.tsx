"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface SubjectSchedulerModalProps {
  onScheduleSubmit: (schedule: { subject: string; days: { [day: string]: { startTime: string; endTime: string } } }) => void;
  onClose: () => void;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const SubjectSchedulerModal: React.FC<SubjectSchedulerModalProps> = ({ onScheduleSubmit, onClose }) => {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<{ [day: string]: boolean }>({});
  const [timings, setTimings] = useState<{ [day: string]: { startTime: string; endTime: string } }>({});
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudentIdFromSession = () => {
      const sessionData = Cookies.get("session");

      if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        setStudentId(parsedSession.user?.id); // Set studentId from session
      } else {
        router.push("/auth/signin"); // Redirect if session data is missing
      }
    };

    fetchStudentIdFromSession();
  }, [router]);

  useEffect(() => {
    // Fetch subjects if studentId is available
    const fetchSubjects = async () => {
      if (studentId) {
        try {
          const response = await fetch(`http://localhost:8000/api/student/${studentId}`, {
            headers: {
              "Authorization": `Bearer ${Cookies.get("token")}`,
            },
          });
          
          if (!response.ok) {
            throw new Error("Failed to fetch subjects");
          }

          const data = await response.json();
          setSubjects(data.coursesList.map((course: any) => course.name));
        } catch (error) {
          console.error(error);
          setError("Failed to load subjects. Please try again.");
        }
      }
    };

    fetchSubjects();
  }, [studentId]);

  const handleDayToggle = (day: string) => {
    setSelectedDays((prevDays) => ({ ...prevDays, [day]: !prevDays[day] }));
  };

  const handleTimingChange = (day: string, field: "startTime" | "endTime", value: string) => {
    setTimings((prevTimings) => ({
      ...prevTimings,
      [day]: { ...prevTimings[day], [field]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTimings = Object.keys(selectedDays).reduce((acc, day) => {
      if (selectedDays[day]) acc[day] = timings[day];
      return acc;
    }, {} as { [day: string]: { startTime: string; endTime: string } });

    onScheduleSubmit({ subject: selectedSubject, days: selectedTimings });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-c5 p-6 rounded-lg shadow-md max-w-lg w-full relative">
        <h2 className="text-xl font-semibold mb-4 text-white text-center">Schedule a Subject</h2>

        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-lg font-bold">
          &times;
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-300 mb-1 font-semibold">Choose Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2 rounded border border-gray-400"
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Choose Days and Set Timings</label>
            <div className="grid grid-cols-2 gap-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex flex-col items-start">
                  <label className="text-gray-200 font-semibold">
                    <input
                      type="checkbox"
                      checked={!!selectedDays[day]}
                      onChange={() => handleDayToggle(day)}
                      className="mr-2"
                    />
                    {day}
                  </label>
                  {selectedDays[day] && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="time"
                        value={timings[day]?.startTime || ""}
                        onChange={(e) => handleTimingChange(day, "startTime", e.target.value)}
                        className="p-1 rounded border border-gray-400"
                        required
                      />
                      <span className="text-gray-200">to</span>
                      <input
                        type="time"
                        value={timings[day]?.endTime || ""}
                        onChange={(e) => handleTimingChange(day, "endTime", e.target.value)}
                        className="p-1 rounded border border-gray-400"
                        required
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="bg-t2 text-white p-2 rounded hover:bg-opacity-80 transition">
            Save Schedule
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubjectSchedulerModal;