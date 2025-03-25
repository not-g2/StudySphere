"use client";
import Lottie from "lottie-react";
import { useTimer } from "@/context/TimerContext";
import { formatTime } from "@/utils/formatTime";
import { useRef, useState } from "react";
import { Button } from "@mui/material";

export default function PomodoroTimer() {
    const {
        time,
        isRunning,
        timerState,
        animations,
        index,
        lastActiveState,
        tag,
        setTag,
        Reset,
        Start,
        Pause,
    } = useTimer();

    const [taginput, setTaginput] = useState("");
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleAddTag = () => {
        setTag(taginput.trim() === "" ? "Default" : taginput);
    };

    return (
        <div className="flex flex-col items-center justify-top bg-gray-900 text-white h-screen w-full">
            <div className="flex flex-col items-center">
                {tag === "Default" ? (
                    <input
                        className={`mt-10 mb-10 rounded-lg text-white w-60 h-10 text-lg text-center border border-gray-400 bg-transparent 
        ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`} // Grays out when disabled
                        placeholder="Enter Tag"
                        value={taginput}
                        onChange={(e) => setTaginput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && buttonRef.current) {
                                buttonRef.current.click();
                            }
                        }}
                        disabled={isRunning} // Disable input when timer is running
                    />
                ) : (
                    <p
                        className="mt-10 mb-10 rounded-lg text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] w-60 h-10 text-lg text-center flex items-center justify-center border-4 border-[#202E4B]"
                        onClick={() => {
                            if (!isRunning) setTag("Default"); // Prevent changing while running
                        }}
                    >
                        {tag}
                    </p>
                )}
            </div>

            <Button
                className="hidden"
                ref={buttonRef}
                onClick={handleAddTag}
            ></Button>
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
                        Start();
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
                        Pause();
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
                        Reset();
                    }}
                    className="bg-red-500 px-4 py-2 rounded text-white"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
