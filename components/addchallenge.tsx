import React, { useState } from 'react';

interface Challenge {
  name: string;
  description: string;
  endDate: string;
}

interface AddChallengeProps {
  onAdd: (challenge: Challenge) => void;
}

const AddChallenge: React.FC<AddChallengeProps> = ({ onAdd }) => {
  const [name, setName] = useState('Example Challenge');
  const [description, setDescription] = useState('This is an example description.');
  const [endDate, setEndDate] = useState('2024-12-31');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name, description, endDate });
    setName('');
    setDescription('');
    setEndDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-700 rounded-lg shadow-lg bg-c3 text-white">
      <div>
        <label className="block font-medium mb-1">Challenge Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter challenge name"
          className="border border-gray-600 bg-c1 text-white p-2 w-full rounded-md"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description"
          className="border border-gray-600 bg-c1 text-white p-2 w-full rounded-md"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-600 bg-c1 text-white p-2 w-full rounded-md"
          required
        />
      </div>
      <button type="submit" className="bg-gray-400 text-white p-2 rounded-md w-full">
        Add Challenge
      </button>
    </form>
  );
};

export default AddChallenge;
