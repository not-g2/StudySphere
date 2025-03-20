"use client";

import React from "react";
import PomodoroTimer from "@/components/Pomodoro/Timer";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <PomodoroTimer />
    </div>
  );
}
