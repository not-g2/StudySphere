// app/components/GDriveUpload.tsx

"use client";

import React, { useState } from 'react';

const GDriveUpload: React.FC = () => {
  const [chapterNumber, setChapterNumber] = useState('');
  const [gdriveLink, setGdriveLink] = useState('');

  const handleChapterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChapterNumber(e.target.value);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGdriveLink(e.target.value);
  };

  const submitGDriveLink = () => {
    console.log("Chapter Number:", chapterNumber);
    console.log("Google Drive Link:", gdriveLink);
    alert(`Chapter ${chapterNumber} link submitted: ${gdriveLink}`);
    setChapterNumber(''); // Clear the chapter number field
    setGdriveLink(''); // Clear the link field
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Upload Google Drive Link</h2>
      <input
        type="number"
        placeholder="Enter Chapter Number"
        value={chapterNumber}
        onChange={handleChapterChange}
        className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-c1 placeholder-c1"
      />
      <input
        type="url"
        placeholder="Enter Google Drive Link"
        value={gdriveLink}
        onChange={handleLinkChange}
        className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-c1 placeholder-c1"
      />
      <button
        onClick={submitGDriveLink}
        className="w-full bg-c4 text-white py-2 px-4 rounded hover:bg-opacity-80 transition"
      >
        Submit Link
      </button>
    </div>
  );
};

export default GDriveUpload;
