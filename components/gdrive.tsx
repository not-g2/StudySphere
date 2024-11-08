"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const GDriveUpload: React.FC = () => {
  const [chapterNumber, setChapterNumber] = useState('');
  const [gdriveLink, setGdriveLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);

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

  const handleChapterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChapterNumber(e.target.value);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGdriveLink(e.target.value);
  };

  const submitGDriveLink = async () => {
    if (!token) {
      alert("You are not authorized.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('chapterNumber', chapterNumber);
    formData.append('gdriveLink', gdriveLink);

    try {
      const response = await fetch('http://localhost:8000/api/upload/chapter', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload Google Drive link.');
      }

      const data = await response.json();
      setSuccessMessage(`Chapter ${chapterNumber} link submitted successfully.`);
      setChapterNumber(''); // Clear the chapter number field
      setGdriveLink(''); // Clear the link field
    } catch (err) {
      setError("Failed to submit the link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2 text-white">Upload Google Drive Link</h2>
      <input
        type="number"
        placeholder="Enter Chapter Number"
        value={chapterNumber}
        onChange={handleChapterChange}
        className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-white placeholder-white"
      />
      <input
        type="url"
        placeholder="Enter Google Drive Link"
        value={gdriveLink}
        onChange={handleLinkChange}
        className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-white placeholder-white"
      />
      <button
        onClick={submitGDriveLink}
        disabled={loading}
        className="w-full bg-t2 text-white py-2 px-4 rounded hover:bg-opacity-80 transition"
      >
        {loading ? "Submitting..." : "Submit Link"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
    </div>
  );
};

export default GDriveUpload;
