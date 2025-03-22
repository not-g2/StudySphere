"use client";
import Lottie from "lottie-react";
import { useTimer } from "@/context/TimerContext";
import { formatTime } from "@/utils/formatTime";

export default function PomodoroTimer() {
    const {
        time,
        setTime,
        isRunning,
        setIsRunning,
        timerState,
        setTimerState,
        animations,
        index,
        lastActiveState,
        setLastActiveState,
    } = useTimer();

    return (
        <div
            className="flex flex-col items-center justify-center bg-gray-900 text-white"
            style={{ height: "calc(100vh - 4rem)" }}
        >
            <h1 className="shadow-orange-500 text-lime-300 text-4xl pb-3">
                Networking
            </h1>
            <div
                className={`flex flex-col items-center justify-center text-5xl font-bold transition-all duration-700 ease-out ${
                    isRunning ||
                    (timerState === "paused" && lastActiveState != null)
                        ? "w-2/3 h-[66vh] scale-100 rounded-[7%] border-4 animate-border-pulse"
                        : "w-64 h-64 scale-100 rounded-[50%] border-4"
                } ${
                    isRunning && timerState === "focus"
                        ? "border-green-500"
                        : ""
                }${
                    isRunning && timerState === "break"
                        ? "border-yellow-500"
                        : ""
                }${!isRunning ? "border-red-500" : ""}`}
            >
                <div className="w-full">
                    {(timerState !== "paused" || lastActiveState) &&
                        animations.length > 0 && (
                            <div className="flex flex-row w-full justify-evenly items-center">
                                <div className="flex justify-center">
                                    <Lottie
                                        animationData={
                                            animations[index].animationData
                                        }
                                        loop={true}
                                        className="w-80 h-80"
                                    />
                                </div>
                                <div className="transition-all duration-1000 ease-in text-xl w-1/2">
                                    {animations[index].text}
                                </div>
                            </div>
                        )}
                </div>
                <span
                    className={`text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-500 ease-out ${
                        isRunning ? "translate-y-8" : ""
                    }`}
                >
                    {formatTime(time)}
                </span>
            </div>

            <div className="mt-6 flex space-x-4">
                <button
                    onClick={() => {
                        setIsRunning(true);
                        setTimerState("focus");
                    }}
                    className={
                        !isRunning
                            ? `bg-green-500 px-4 py-2 rounded text-white`
                            : "bg-gray-600 px-4 py-2 rounded text-gray-400 cursor-not-allowed"
                    }
                >
                    Start
                </button>
                <button
                    onClick={() => {
                        setIsRunning(false);
                        setTimerState("paused");
                    }}
                    className={
                        isRunning
                            ? "bg-yellow-500 px-4 py-2 rounded text-white"
                            : "bg-gray-600 px-4 py-2 rounded text-gray-400 cursor-not-allowed"
                    }
                >
                    Pause
                </button>
                <button
                    onClick={() => {
                        setIsRunning(false);
                        setTimerState("paused");
                        setLastActiveState(null);
                        setTime(25 * 60);
                    }}
                    className="bg-red-500 px-4 py-2 rounded text-white"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
