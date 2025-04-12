"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface Deadline {
    title: string;
    description: string;
    startdate: string;
    enddate: string;
}

interface DeadlineFormProps {
    onAddDeadline: (deadline: Deadline) => void;
}

const DeadlineForm: React.FC<DeadlineFormProps> = ({ onAddDeadline }) => {
    const [title, setName] = useState("");
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
        if (title && description && startdate && enddate) {
            const newDeadline = {
                userId: session.user.id,
                title,
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
                        onAddDeadline(createdEvent);
                        setName("");
                        setDescription("");
                        setStartDate("");
                        setEndDate("");
                    } else {
                        alert("Failed to create event");
                    }
                }
            } catch (error) {
                console.error("Error creating event:", error);
                alert("Error occurred while creating event");
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
                        className="block text-gray-600 font-bold mb-2"
                        htmlFor="name"
                    >
                        Reminder Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={title}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter reminder name"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-600 font-bold mb-2"
                        htmlFor="description"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a description"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-600 font-bold mb-2"
                        htmlFor="startDate"
                    >
                        Start Date & Time
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
                        className="block text-gray-600 font-bold mb-2"
                        htmlFor="endDate"
                    >
                        End Date & Time
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
