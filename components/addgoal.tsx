import React, { useState } from 'react';

interface Goal {
  name: string;
  endDate: string;
}

interface AddGoalFormProps {
  onAddGoal: (goal: Goal) => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal }) => {
  const [name, setName] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && endDate) {
      onAddGoal({ name, endDate });
      setName('');
      setEndDate('');
    } else {
      alert("Please fill out both the goal name and end date.");
    }
  };

  return (
    <div className="bg-c5 p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-white text-center">Add a New Goal</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-gray-300 mb-1 font-semibold">Goal Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter goal name"
            className="w-full p-2 rounded border border-gray-400"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1 font-semibold">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 rounded border border-gray-400"
            required
          />
        </div>
        <button type="submit" className="bg-t2 text-white p-2 rounded hover:bg-opacity-80 transition">
          Add Goal
        </button>
      </form>
    </div>
  );
};

export default AddGoalForm;
