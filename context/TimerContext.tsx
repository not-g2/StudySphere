"use client";
import { createContext, useContext, useState, useEffect } from "react";

type TimerState = "focus" | "break" | "paused";
type lastActiveState = "focus" | "break" | null;

interface TimerContextType {
    time: number;
    setTime: (time: number) => void;
    isRunning: boolean;
    setIsRunning: (isRunning: boolean) => void;
    timerState: TimerState;
    setTimerState: (state: TimerState) => void;
    index: number;
    animations: { animationData: any; text: string }[];
    lastActiveState: lastActiveState;
    setLastActiveState: (state: lastActiveState) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
    const [time, setTime] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [timerState, setTimerState] = useState<TimerState>("paused");
    const [lastActiveState, setLastActiveState] = useState<
        "focus" | "break" | null
    >(null);
    const [animations, setAnimations] = useState<
        { animationData: any; text: string }[]
    >([]);
    const [index, setIndex] = useState(0);
    const [cycleCount, setCycleCount] = useState(0);

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
        if (timerState === "paused") return;

        const interval = setInterval(() => {
            setIndex((prevIndex) => {
                if (timerState === "focus") {
                    return (prevIndex + 1) % 4;
                }
                if (timerState === "break") {
                    return 4 + ((prevIndex - 4 + 1) % 4);
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

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (isRunning && cycleCount < 3) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime > 0) return prevTime - 1;

                    if (timerState === "focus") {
                        setTimerState("break");
                        setTime(5 * 60);
                        return 5 * 60;
                    } else if (timerState === "break") {
                        const newCycleCount = cycleCount + 1;
                        setCycleCount(newCycleCount);

                        if (newCycleCount >= 3) {
                            setIsRunning(false);
                            setTimerState("paused");
                            setLastActiveState(null);
                            setCycleCount(0);
                            return prevTime;
                        }

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
    }, [isRunning, timerState, cycleCount]);

    useEffect(() => {
        const savedTime = localStorage.getItem("timer-time");
        const savedIsRunning = localStorage.getItem("timer-isRunning");
        const savedState = localStorage.getItem("timer-state");
        const savedCycles = localStorage.getItem("timer-cycles");

        if (savedTime) setTime(parseInt(savedTime, 10));
        if (savedIsRunning) setIsRunning(savedIsRunning === "true");
        if (savedState)
            setTimerState(savedState as "focus" | "break" | "paused");
        if (savedCycles) setCycleCount(parseInt(savedCycles, 10));
    }, []);

    useEffect(() => {
        localStorage.setItem("timer-time", time.toString());
        localStorage.setItem("timer-isRunning", isRunning.toString());
        localStorage.setItem("timer-state", timerState);
        localStorage.setItem("timer-cycles", cycleCount.toString());
    }, [time, isRunning, timerState, cycleCount]);

    return (
        <TimerContext.Provider
            value={{
                time,
                setTime,
                isRunning,
                setIsRunning,
                timerState,
                setTimerState,
                index,
                animations,
                lastActiveState,
                setLastActiveState,
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error("useTimer must be used within a TimerProvider");
    }
    return context;
};
