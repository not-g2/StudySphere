import React, { useState } from "react";

type DueDateModalProps = {
  assignmentTitle: string;
  onClose: () => void;
  onUpdateDueDate: (newDate: string) => void;
};

const DueDateModal: React.FC<DueDateModalProps> = ({
  assignmentTitle,
  onClose,
  onUpdateDueDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleUpdateClick = () => {
    if (selectedDate) {
      onUpdateDueDate(selectedDate);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-80 text-center">
        <h2 className="text-xl font-semibold mb-4">Update Due Date</h2>
        <p className="mb-2">Assignment: {assignmentTitle}</p>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Select new due date"
        />
        <div className="flex justify-around mt-4">
          <button
            onClick={handleUpdateClick}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Update Due Date
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 mt-4 hover:text-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DueDateModal;
