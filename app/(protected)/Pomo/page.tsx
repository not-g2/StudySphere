"use client";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";

export default function PomodoroTimer() {
    const [timerState, setTimerState] = useState<"focus" | "break" | "paused">(
        "paused"
    );
    const [time, setTime] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [lastActiveState, setLastActiveState] = useState<
        "focus" | "break" | null
    >(null);
    const [animations, setAnimations] = useState<
        { animationData: any; text: string }[]
    >([]);
    const [index, setIndex] = useState(0);

    const animationData = [
        {
            path: "/goals.json",
            text: "Set clear, achievable goals - Define exactly what you want to accomplish during your focus session before you begin.",
        },
        {
            path: "/music.json",
            text: "Try focus-enhancing background sounds - White noise, nature sounds, or instrumental music can help some people concentrate better.",
        },
        {
            path: "/teamwork.json",
            text: "Try body doubling - Work alongside someone else who is also focusing (in person or virtually) to create mutual accountability.",
        },
        {
            path: "/sleeping.json",
            text: "Manage your energy, not just time - Recognize when your focus naturally wanes and schedule accordingly.",
        },
        {
            path: "/talkwithothers.json",
            text: "Connect briefly with others - A short social interaction can boost mood and provide perspective.",
        },
        {
            path: "/hydration.json",
            text: "Hydrate and nourish - Use breaks to drink water or have a healthy snack to maintain your energy levels.",
        },
        {
            path: "/meditate.json",
            text: "Practice mindfulness - Take a few deep breaths or do a quick meditation to reset your mental state.",
        },
        {
            path: "/Schedule.json",
            text: "Schedule regular breaks - Build breaks into your daily routine rather than waiting until you're exhausted or overwhelmed.",
        },
    ];

    useEffect(() => {
        Promise.all(
            animationData.map(async (anim) => {
                const response = await fetch(anim.path);
                const json = await response.json();
                return { animationData: json, text: anim.text };
            })
        )
            .then((data) => setAnimations(data))
            .catch((err) => console.error("Failed to load animations:", err));
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime > 0) return prevTime - 1;
                    if (timerState === "focus") {
                        setTimerState("break");
                        setIndex(4);
                        return 5 * 60;
                    } else if (timerState === "break") {
                        setIsRunning(true);
                        setTimerState("focus");
                        return 25 * 60;
                    }
                    return prevTime;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, timerState]);

    useEffect(() => {
        if (timerState === "paused") return;

        const interval = setInterval(() => {
            setIndex((prevIndex) => {
                if (timerState === "focus") {
                    return (prevIndex + 1) % 4; // First 4 are focus animations
                }
                if (timerState === "break") {
                    return 4 + ((prevIndex - 4 + 1) % 4); // Next 4 are break animations
                }
                return prevIndex;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [timerState]);

    useEffect(() => {
        if (timerState !== "paused") {
            setLastActiveState(timerState);
        }
    }, [timerState]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
            2,
            "0"
        )}`;
    };

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
                        ? "w-2/3 h-[66vh] scale-100 rounded-[7%] border-4"
                        : "w-64 h-64 scale-100 rounded-[50%] border-4"
                } ${isRunning ? "border-green-500" : "border-red-500"}`}
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
                    className={`text-white drop-shadow-lg transition-all duration-500 ease-out ${
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
                    className="bg-green-500 px-4 py-2 rounded text-white"
                >
                    Start
                </button>
                <button
                    onClick={() => {
                        setIsRunning(false);
                        setTimerState("paused");
                    }}
                    className="bg-yellow-500 px-4 py-2 rounded text-white"
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
