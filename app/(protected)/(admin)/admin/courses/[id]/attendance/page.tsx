"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";

interface Student {
    _id: string;
    name: string;
}

const AttendancePage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId || params.id; // Adjust based on your route parameter

    const [session, setSession] = useState<any>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<{ [key: string]: boolean }>(
        {}
    );
    const [date, setDate] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Function to get the session profile
    const GetProfile = async () => {
        const sessionData: string | undefined = Cookies.get("session");

        if (sessionData && !session) {
            setSession(JSON.parse(sessionData));
        } else if (!sessionData) {
            router.push("/auth/signin");
        }
    };

    // Fetch the session on component mount
    useEffect(() => {
        GetProfile();
    }, []);

    // Fetch students when session and courseId are available
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                if (!session) {
                    console.log("Session not available yet.");
                    return;
                }
                const token = session.user.token;
                if (!token)
                    throw new Error("Token not found. Please log in again.");
                if (!courseId) throw new Error("Course ID not found.");

                console.log("Fetching students for course:", courseId);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/courses/${courseId}/students`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch students.");
                }

                const data = await response.json();
                console.log("Fetched students data:", data);
                setStudents(data.students);
                // Initialize attendance state to false for each student
                setAttendance(
                    data.students.reduce(
                        (acc: { [key: string]: boolean }, student: Student) => {
                            acc[student._id] = false;
                            return acc;
                        },
                        {}
                    )
                );
            } catch (err) {
                setError("Failed to load students. Please try again later.");
                console.error("Error fetching students:", err);
            }
        };

        if (session && courseId) {
            fetchStudents();
        }
    }, [session, courseId]);

    // When the date changes, reset attendance and fetch each student's attendance summary
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
        // Reset attendance for the new date
        setAttendance(
            students.reduce((acc, student) => {
                acc[student._id] = false;
                return acc;
            }, {} as { [key: string]: boolean })
        );
    };

    // New useEffect: For each student, fetch their attendance summary for the selected date.
    useEffect(() => {
        const fetchAttendanceForStudents = async () => {
            if (!date || !session) return;

            const token = session.user.token;
            if (!token) return;

            // Create a new attendance object to update based on fetched summaries.
            const updatedAttendance: { [key: string]: boolean } = {
                ...attendance,
            };

            await Promise.all(
                students.map(async (student) => {
                    try {
                        const response = await fetch(
                            `${process.env.NEXT_PUBLIC_URL}/api/adminauth/summary/${student._id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        if (!response.ok) {
                            throw new Error(
                                `Failed to fetch summary for student ${student._id}`
                            );
                        }
                        const data = await response.json();
                        // data is expected to have a structure like:
                        // { name: string, attendance: { [courseName]: [{ date, status }, ...] } }
                        let found = false;
                        // Loop over each course in the summary
                        for (const course in data.attendance) {
                            const record = data.attendance[course].find(
                                (rec: any) => {
                                    // Convert record.date to YYYY-MM-DD format for comparison
                                    const recordDate = new Date(rec.date)
                                        .toISOString()
                                        .slice(0, 10);
                                    return recordDate === date;
                                }
                            );
                            if (record) {
                                // Update attendance based on status: true for "present", false for "absent"
                                updatedAttendance[student._id] =
                                    record.status === "present";
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            updatedAttendance[student._id] = false;
                        }
                    } catch (error) {
                        console.error(
                            "Error fetching attendance summary for student",
                            student._id,
                            error
                        );
                        updatedAttendance[student._id] = false;
                    }
                })
            );

            setAttendance(updatedAttendance);
        };

        fetchAttendanceForStudents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, session, students]);

    const toggleAttendance = (studentId: string) => {
        setAttendance((prevAttendance) => ({
            ...prevAttendance,
            [studentId]: !prevAttendance[studentId],
        }));
    };

    // Handle submit: post attendance records for each student using the provided POST route.
    const handleSubmit = async () => {
        if (!date) {
            alert("Please select a date.");
            return;
        }

        // Retrieve token from cookies in the same way as GetProfile
        const sessionData: string | undefined = Cookies.get("session");

        if (!sessionData) {
            setError("Session not found. Please log in again.");
            router.push("/auth/signin");
            return;
        }

        const sessionFromCookie = JSON.parse(sessionData);
        const token = sessionFromCookie.user.token;

        if (!token) {
            setError("Authentication token not found. Please log in again.");
            return;
        }

        setLoading(true);
        setError(null);

        const attendanceData = students.map((student) => ({
            userId: student._id,
            courseId,
            date,
            status: attendance[student._id] ? "present" : "absent",
        }));

        try {
            await Promise.all(
                attendanceData.map(async (record) => {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_URL}/api/adminauth/post/mark`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(record),
                        }
                    );
                    if (!response.ok) {
                        throw new Error(
                            `Failed to mark attendance for ${record.userId}`
                        );
                    }
                })
            );

            alert(`Attendance for ${date} has been recorded!`);
        } catch (err) {
            setError("Failed to submit attendance. Please try again.");
            console.error("Error submitting attendance:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 min-h-screen bg-c2 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4 text-white">
                Attendance
            </h2>
            <div className="bg-c5 p-6 rounded shadow-md w-full max-w-md">
                {/* Date Picker */}
                <div className="mb-6">
                    <label className="block text-white font-medium mb-2">
                        Select Date
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={handleDateChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Attendance List */}
                <ul className="space-y-4">
                    {students.map((student) => (
                        <li key={student._id} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={attendance[student._id]}
                                onChange={() => toggleAttendance(student._id)}
                                className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label className="text-white">{student.name}</label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-6 bg-c1 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
                {loading ? "Submitting..." : "Submit Attendance"}
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
};

export default AttendancePage;
