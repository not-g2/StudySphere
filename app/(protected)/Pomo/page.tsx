"use client";
import { useState, useEffect, useRef } from "react";
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
    const pauseAnimation = [
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
            text: "Schedule regular breaks - Build breaks into your daily routine rather than waiting until you're exhausted or overwhelmed",
        },
    ];
    const runAnimation = [
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
    ];

    const [animations, setAnimations] = useState<any[]>([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        Promise.all(
            runAnimation.map((anim) =>
                fetch(anim.path).then((res) => res.json())
            )
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

                    // When timer hits 0, check the current state
                    if (timerState === "focus") {
                        setTimerState("break"); // Switch to break mode
                        return 5 * 60; // Set break time to 5 minutes (300 seconds)
                    } else if (timerState === "break") {
                        setIsRunning(false); // Stop timer after break
                        setTimerState("paused"); // Pause after break ends
                        return 25 * 60; // Reset back to 25 minutes for next session
                    }

                    return prevTime;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isRunning, timerState]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
            2,
            "0"
        )}`;
    };

    useEffect(() => {
        if (timerState === "paused") return;
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % pauseAnimation.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [animations, timerState]);

    useEffect(() => {
        if (timerState !== "paused") {
            setLastActiveState(timerState);
        }
    }, [timerState]);

    return (
        <div
            className="flex flex-col items-center justify-center bg-gray-900 text-white "
            style={{ height: "calc(100vh - 4rem)" }}
        >
            <h1 className="shadow-orange-500 text-lime-300 text-4xl pb-3">
                Networking
            </h1>
            <div
                className={`flex flex-col items-center justify-center text-5xl font-bold
                    transition-all duration-700 ease-out
                    ${
                        isRunning ||
                        (timerState === "paused" && lastActiveState != null)
                            ? "w-2/3 h-[66vh] scale-100 rounded-[7%] border-4"
                            : "w-64 h-64 scale-100 rounded-[50%] border-4"
                    }${isRunning ? "border-green-500" : "border-red-500"}`}
            >
                <div className="w-full">
                    {(timerState === "focus" ||
                        (timerState === "paused" &&
                            lastActiveState === "focus")) && (
                        <div className="flex flex-row w-full justify-evenly items-center">
                            <div className="flex justify-center">
                                {animations.length > 0 && (
                                    <Lottie
                                        animationData={animations[index]}
                                        loop={true}
                                        className="w-80 h-80"
                                    />
                                )}
                            </div>
                            <div className="transition-all duration-1000 ease-in text-xl w-1/2">
                                {`${runAnimation[index].text}`}
                            </div>
                        </div>
                    )}

                    {(timerState === "break" ||
                        (timerState === "paused" &&
                            lastActiveState === "break")) && (
                        <div className="flex flex-row w-full justify-evenly items-center">
                            <div className="flex justify-center">
                                {animations.length > 0 && (
                                    <Lottie
                                        animationData={animations[index]}
                                        loop={true}
                                        className="w-80 h-80"
                                    />
                                )}
                            </div>
                            <div className="transition-all duration-1000 ease-in text-xl w-1/2">
                                {`${runAnimation[index].text}`}
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
