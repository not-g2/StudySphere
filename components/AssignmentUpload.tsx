import React, { useState, useRef } from "react";

const AssignmentUpload: React.FC<{ courseId: number; token: string | undefined }> = ({ courseId, token }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    try {
      const response = await fetch("http://localhost:8000/api/assgn/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          course: courseId,
          dueDate,
        }),
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