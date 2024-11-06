import React, { useState } from "react";

const AnnouncementSection: React.FC = () => {
  const [announcement, setAnnouncement] = useState("");

  const handleAnnouncementChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnnouncement(e.target.value);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2 text-white">Make an Announcement</h2>
      <textarea
        value={announcement}
        onChange={handleAnnouncementChange}
        placeholder="Write an announcement..."
        rows={4}
        className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-white placeholder-white"
      ></textarea>
      <button
        onClick={() => alert(`Announcement posted: ${announcement}`)}
        className="text-white w-full bg-t2 py-2 px-4 rounded hover:bg-opacity-80 transition"
      >
        Post Announcement
      </button>
    </div>
  );
};

export default AnnouncementSection;
