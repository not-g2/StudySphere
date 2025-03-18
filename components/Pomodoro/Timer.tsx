import React, { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const PomodoroTimer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0);
  const duration = 25 * 60; // 25 minutes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Pomodoro Timer</h1>
      <CountdownCircleTimer
        key={key}
        isPlaying={isPlaying}
        duration={duration}
        // Changed the colors to a gradient of green and blue.
        colors={["#10B981", "#3B82F6"] as ["#10B981", "#3B82F6"]}
        size={200}
        strokeWidth={12}
        onComplete={() => {
          alert("Time's up!");
          return { shouldRepeat: false };
        }}
      >
        {({ remainingTime }) => {
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          return (
            <div className="text-2xl font-bold">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>
          );
        }}
      </CountdownCircleTimer>

      <div className="flex space-x-4 mt-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg"
        >
          {isPlaying ? "Pause" : "Start/Resume"}
        </button>
        <button
          onClick={() => {
            setIsPlaying(false);
            setKey((prevKey) => prevKey + 1);
          }}
          className="px-6 py-2 bg-red-500 text-white rounded-lg"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
