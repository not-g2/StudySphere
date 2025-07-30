"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface Deadline {
  description: string;
  startdate: string;
  enddate: string;
}

interface DeadlineFormProps {
  onAddDeadline: (deadline: Deadline) => void;
}

const DeadlineForm: React.FC<DeadlineFormProps> = ({ onAddDeadline }) => {
  const [description, setDescription] = useState("");
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const sessionData = Cookies.get("session");
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/auth/signin";
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description && startdate && enddate) {
      const newDeadline = {
        userId: session.user.id,
        description,
        startdate,
        enddate,
      };

      try {
        if (session) {
          const token = session.user.token;
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/reminder/reminders`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newDeadline),
            }
          );
          if (response.ok) {
            const createdEvent = await response.json();
            // createdEvent.description, startdate, enddate, etc.
            onAddDeadline({
              description: createdEvent.description,
              startdate: createdEvent.startdate,
              enddate: createdEvent.enddate,
            });
            setDescription("");
            setStartDate("");
            setEndDate("");
          } else {
            alert("Failed to create reminder");
          }
        }
      } catch (error) {
        console.error("Error creating reminder:", error);
        alert("Error occurred while creating reminder");
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Add Reminder
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-600 font-bold mb-2"
          >
            Name
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter reminder"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="startDate"
            className="block text-gray-600 font-bold mb-2"
          >
            Start Date &amp; Time
          </label>
          <input
            type="datetime-local"
            id="startDate"
            value={startdate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="endDate"
            className="block text-gray-600 font-bold mb-2"
          >
            End Date &amp; Time
          </label>
          <input
            type="datetime-local"
            id="endDate"
            value={enddate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-700 text-white font-bold py-2 rounded-md hover:bg-gray-800 transition duration-200"
        >
          Add Reminder
        </button>
      </form>
    </div>
  );
};

export default DeadlineForm;
