"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSessionCheck from "../../hooks/auth";
import dynamicq from "next/dynamic";
import ClassCodePopup from "../../../components/classAdd";
import { Session } from "@/types/session";

interface classItem {
    _id: string;
    name: string;
    description: string;
    students: string[];
    chapters: string[];
    createdAt: string;
    __v: number;
    coursePic: {
        publicId: { type: string };
        url: { type: string };
    };
}

interface Announcement {
    heading: string;
}

interface Assignment {
    title: string;
    dueDate: string;
}

interface ClassCardProps {
    classItem: classItem;
    token: string;
    handleCardClick: (id: string) => void;
    index: number;
}

const ClassCard: React.FC<ClassCardProps> = ({
    classItem,
    token,
    handleCardClick,
    index,
}) => {
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [assignment, setAssignment] = useState<Assignment | null>(null);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/announce/${classItem._id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        method: "GET",
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setAnnouncement(data?.[0] || null);
                } else setAnnouncement(null);
            } catch {
                setAnnouncement(null);
            }
        };

        const fetchAssignment = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/assgn/course/${classItem._id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        method: "GET",
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    const today = new Date().toISOString().split("T")[0];
                    const dueToday = data.find(
                        (assgn: Assignment) =>
                            assgn.dueDate.split("T")[0] === today
                    );
                    setAssignment(dueToday || null);
                } else setAssignment(null);
            } catch {
                setAssignment(null);
            }
        };

        fetchAnnouncement();
        fetchAssignment();
    }, [classItem._id, token]);

    const gradients = [
        "bg-gradient-to-br from-green-300 to-green-100",
        "bg-gradient-to-br from-blue-200 to-blue-100",
        "bg-gradient-to-br from-cyan-200 to-sky-100",
        "bg-gradient-to-br from-indigo-300 to-teal-200",
        "bg-gradient-to-br from-blue-400 to-blue-100",
    ];

    return (
        <div
            onClick={() => handleCardClick(classItem._id)}
            className={`w-full max-w-sm h-[300px] rounded-xl shadow-md p-4 cursor-pointer animate-fade-up ${
                gradients[index % gradients.length]
            }`}
            style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: "forwards",
            }}
        >
            <div className="flex flex-col justify-between h-full">
                <div>
                    <h2 className="text-lg font-bold text-black">
                        {classItem.name}
                    </h2>
                    <p className="text-sm text-black mt-1 line-clamp-2">
                        {classItem.description}
                    </p>

                    <div className="mt-2">
                        <p className="font-semibold text-black">
                            Announcement:
                        </p>
                        <p className="text-black text-sm">
                            {announcement
                                ? announcement.heading
                                : "No announcements"}
                        </p>

                        <p className="font-semibold mt-2 text-black">
                            Assignment:
                        </p>
                        <p className="text-black text-sm">
                            {assignment
                                ? assignment.title
                                : "No assignment due today"}
                        </p>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <img
                        src="/teach1.jpg"
                        alt={`${classItem.name} cover`}
                        className="w-28 h-28 object-cover rounded-full border-2 border-black"
                    />
                </div>
            </div>
        </div>
    );
};

const ClassesPage = () => {
    const PORT = 8000;
    const router = useRouter();
    const [classesData, setClassesData] = useState<classItem[]>([]);
    const [session, setSession] = useState<Session | null>(null);
    const [openClassCodePopup, setOpenClassCodePopup] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleCardClick = (classId: string) =>
        router.push(`/Courses/${classId}`);

    useSessionCheck(setSession);

    useEffect(() => {
        const getClasses = async () => {
            if (session) {
                setLoading(true);
                try {
                    const response = await fetch(
                        `http://localhost:${PORT}/api/courses/student/${session.user.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${session.user.token}`,
                            },
                            method: "GET",
                        }
                    );
                    const data = await response.json();
                    setClassesData(data?.coursesList || []);
                } catch (error) {
                    console.error("Error Getting Classes Details:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        getClasses();
    }, [session, openClassCodePopup, PORT]);

    const handleCloseClassCodePopup = () => setOpenClassCodePopup(false);

    const onJoinClass = async (classCode: string) => {
        if (session) {
            try {
                await fetch(`http://localhost:${PORT}/api/courses/add-course`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.user.token}`,
                    },
                    body: JSON.stringify({
                        studentId: session.user.id,
                        courseCode: classCode,
                    }),
                });
            } catch (error) {
                console.error("Network error:", error);
            }
        }
    };

    return (
        <div className="bg-[#001D3D] min-h-screen w-full">
            <div className="bg-gray-100 text-black p-6 flex flex-col items-center">
                <div className="flex justify-between w-full max-w-7xl items-center">
                    <h1 className="text-3xl font-semibold">Your Classes</h1>
                    <button
                        onClick={() => setOpenClassCodePopup(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
                    >
                        Join Class
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 w-full max-w-7xl">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="w-full h-[300px] bg-gray-300 animate-pulse rounded-lg"
                            ></div>
                        ))
                    ) : classesData.length > 0 ? (
                        classesData.map((classItem, index) => (
                            <ClassCard
                                key={classItem._id}
                                classItem={classItem}
                                token={session?.user.token!}
                                handleCardClick={handleCardClick}
                                index={index}
                            />
                        ))
                    ) : (
                        <p className="text-lg text-gray-500 mt-4">
                            No classes available.
                        </p>
                    )}
                </div>

                <ClassCodePopup
                    open={openClassCodePopup}
                    handleClose={handleCloseClassCodePopup}
                    onJoinClass={onJoinClass}
                />
            </div>
        </div>
    );
};

export default dynamicq(() => Promise.resolve(ClassesPage), { ssr: false });
