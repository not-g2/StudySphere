"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

const AnnouncementSection: React.FC = () => {
  const [title, setTitle] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);
  const params = useParams();
  const courseId = params.id;

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

  const handleAnnouncementChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnnouncement(e.target.value);
  };

  const postAnnouncement = async () => {
    if (!token) {
      alert("You are not authorized.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/adminauth/post/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          description: announcement,
          course: courseId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post announcement.");
      }

      const data = await response.json();
      alert(`Announcement posted: ${data.announcement.title}`);
      setTitle("");
      setAnnouncement("");
    } catch (err) {
      setError("Failed to post the announcement. Please try again later.");
      console.error("Error posting announcement:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2 text-white">Make an Announcement</h2>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Announcement Title"
        className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-white placeholder-white"
      />
      <textarea
        value={announcement}
        onChange={handleAnnouncementChange}
        placeholder="Write an announcement..."
        rows={4}
        className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-white placeholder-white"
      ></textarea>
      <button
        onClick={postAnnouncement}
        disabled={loading}
        className="text-white w-full bg-t2 py-2 px-4 rounded hover:bg-opacity-80 transition"
      >
        {loading ? "Posting..." : "Post Announcement"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AnnouncementSection;
