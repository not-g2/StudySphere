import React, { useState } from 'react';

interface Deadline {
  name: string;
  description: string;
  deadlineDate: string;
}

interface DeadlineFormProps {
  onAddDeadline: (deadline: Deadline) => void;
}

const DeadlineForm: React.FC<DeadlineFormProps> = ({ onAddDeadline }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && description && deadlineDate) {
      const newDeadline: Deadline = {
        name,
        description,
        deadlineDate,
      };
      onAddDeadline(newDeadline);
      setName('');
      setDescription('');
      setDeadlineDate('');
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="bg-c5 shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-white">Add Reminder</h2>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-400 font-bold mb-2" htmlFor="name">
            Reminder Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter deadline name"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label className="block text-gray-400 font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Date/Time Field */}
        <div className="mb-4">
          <label className="block text-gray-400 font-bold mb-2" htmlFor="deadlineDate">
            Deadline Date & Time
          </label>
          <input
            type="datetime-local"
            id="deadlineDate"
            value={deadlineDate}
            onChange={(e) => setDeadlineDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Add Deadline
        </button>
      </form>
    </div>
  );
};

export default DeadlineForm;
