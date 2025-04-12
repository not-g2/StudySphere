"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";

const GDriveUpload: React.FC = () => {
    const [title, setTitle] = useState(""); // Renamed from chapterNumber to title
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [token, setToken] = useState<string | undefined>(undefined);

    const params = useParams();
    const courseId = params.id; // Get courseId from the URL

    useEffect(() => {
        // Retrieve token from cookies
        const sessionData = Cookies.get("session");
        if (sessionData) {
            const parsedSession = JSON.parse(sessionData);
            setToken(parsedSession.user.token);
        } else {
            console.log("No session cookie found");
        }
    }, []);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const submitFile = async () => {
        if (!token) {
            alert("You are not authorized.");
            return;
        }

        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        if (!courseId) {
            alert("Course ID is missing.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append("title", title); // Use title instead of chapterNumber
        formData.append("courseID", courseId as string);
        formData.append("pdfFile", file);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/chapter/create`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to upload file.");
            }

            const data = await response.json();
            console.log(data);
            setSuccessMessage(`File for "${title}" uploaded successfully.`);
            setTitle(""); // Clear the title field
            setFile(null); // Clear the file input
        } catch (err) {
            setError("Failed to upload the file. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2 text-white">
                Upload Chapter File
            </h2>
            <input
                type="text" // Changed input type to text for title
                placeholder="Enter Title"
                value={title}
                onChange={handleTitleChange}
                className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-white placeholder-white"
            />
            <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-white placeholder-white"
            />
            <button
                onClick={submitFile}
                disabled={loading}
                className="w-full bg-t2 text-white py-2 px-4 rounded hover:bg-opacity-80 transition"
            >
                {loading ? "Submitting..." : "Submit File"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {successMessage && (
                <p className="text-green-500 mt-2">{successMessage}</p>
            )}
        </div>
    );
};

export default GDriveUpload;
