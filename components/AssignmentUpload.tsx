import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";

const AssignmentUpload: React.FC<{ courseId: string }> = ({ courseId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const createAssignment = async () => {
    if (!token) {
      alert("You are not authorized.");
      return;
    }

    const createdBy = "672b171ab92e240998f0668b"; // Replace with actual user ID if needed

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("course", courseId);
      formData.append("dueDate", dueDate);
      formData.append("createdBy", createdBy);
      if (selectedFile) {
        formData.append("pdfFile", selectedFile);
      }

      const response = await fetch("http://localhost:8000/api/adminauth/post/assgn", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create assignment.");

      const data = await response.json();
      alert(`Assignment created successfully: ${data.assignment.title}`);
      setTitle("");
      setDescription("");
      setDueDate("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("There was an error creating the assignment. Please try again.");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2 text-white">Upload Assignment</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Assignment Title"
        className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-white"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Assignment Description"
        rows={4}
        className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-white"
      ></textarea>
      <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
      <button onClick={() => fileInputRef.current?.click()} className="w-full bg-t2 text-white py-2 px-4 rounded mb-4 hover:bg-opacity-80 transition">
        {selectedFile ? selectedFile.name : "Choose File"}
      </button>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-4 bg-c5 text-white placeholder-c1"
        placeholder="Select due date"
      />
      <button onClick={createAssignment} className="w-full bg-t2 text-white py-2 px-4 rounded hover:bg-opacity-80 transition">
        Submit Assignment
      </button>
    </div>
  );
};

export default AssignmentUpload;
