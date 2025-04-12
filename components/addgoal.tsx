"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Goal {
    name: string;
    endDate: string;
}

interface AddGoalFormProps {
    onAddGoal: (goal: Goal) => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal }) => {
    const [name, setName] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [session, setSession] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const sessionData = Cookies.get("session");

        if (sessionData) {
            const parsedSession = JSON.parse(sessionData);
            setSession(parsedSession);
        } else {
            router.push("/auth/signin"); // Redirect if no session data
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (name && endDate) {
            try {
                const newGoal = {
                    title: name,
                    description: name,
                    dueDate: endDate,
                };

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/goals/`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user.token}`,
                        },
                        body: JSON.stringify(newGoal),
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to add goal");
                }

                const savedGoal = await response.json();
                setName("");
                setEndDate("");
                setError(null);
                onAddGoal({
                    name: savedGoal.title,
                    endDate: savedGoal.dueDate,
                });
            } catch (err) {
                console.error(err);
                setError("Failed to add goal. Please try again.");
            }
        } else {
            alert("Please fill out both the goal name and end date.");
        }
    };

    return (
        <div className="bg-c5 p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-white text-center">
                Add a New Goal
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div>
                    <label className="block text-gray-300 mb-1 font-semibold">
                        Goal Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter goal name"
                        className="w-full p-2 rounded border border-gray-400"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1 font-semibold">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 rounded border border-gray-400"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-t2 text-white p-2 rounded hover:bg-opacity-80 transition"
                >
                    Add Goal
                </button>
            </form>
        </div>
    );
};

export default AddGoalForm;
