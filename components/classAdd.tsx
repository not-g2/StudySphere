"use client";

import React, { useState } from "react";
import clsx from "clsx";

interface ClassCodePopupProps {
    open: boolean;
    handleClose: () => void;
    onJoinClass: (classCode: string, joinType: "course" | "group") => void;
}

const ClassCodePopup: React.FC<ClassCodePopupProps> = ({
    open,
    handleClose,
    onJoinClass,
}) => {
    const [classCode, setClassCode] = useState("");
    const [joinType, setJoinType] = useState<"course" | "group">("course");
    const [error, setError] = useState("");

    const handleJoin = () => {
        if (classCode.trim() === "") {
            setError("Please enter a class code");
            return;
        }
        onJoinClass(classCode, joinType);
        setClassCode("");
        setError("");
        handleClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Join a Class or Group
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Class/Group Code
                    </label>
                    <input
                        type="text"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        className={clsx(
                            "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                            error && "border-red-500"
                        )}
                        autoFocus
                    />
                    {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                </div>

                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        Join as:
                    </p>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="course"
                                checked={joinType === "course"}
                                onChange={() => setJoinType("course")}
                                className="accent-blue-600"
                            />
                            <span>Course</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="group"
                                checked={joinType === "group"}
                                onChange={() => setJoinType("group")}
                                className="accent-blue-600"
                            />
                            <span>Group</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleJoin}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Join
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassCodePopup;
