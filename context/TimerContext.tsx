"use client";
import { createContext, useContext, useState, useEffect } from "react";
import useSessionCheck from "@/app/hooks/auth";
import { toast } from "react-toastify";
import { formatTimeHours } from "@/utils/formatTime";

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
    tag: string;
    setTag: (tags: string) => void;
    Reset: () => void;
    Start: () => void;
    Pause: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setsession] = useState<any>(null);
    const maxCycleCount = 3;
    const focusTime = 25 * 60;
    const breakTime = 5 * 60;
    const [time, setTime] = useState(focusTime);
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
    const [tag, setTag] = useState("Default");
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
    useSessionCheck(setsession);

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

        if (isRunning && cycleCount < maxCycleCount) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime > 0) return prevTime - 1;

                    if (timerState === "focus") {
                        setTimerState("break");
                        setTime(breakTime);
                        return breakTime;
                    } else if (timerState === "break") {
                        const newCycleCount = cycleCount + 1;
                        setCycleCount(newCycleCount);

                        if (newCycleCount >= maxCycleCount) {
                            Reset();
                            return prevTime;
                        }

                        setTimerState("focus");
                        return focusTime;
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
        const savedTag = localStorage.getItem("timer-tag");

        if (savedTime) setTime(parseInt(savedTime, 10));
        if (savedIsRunning) setIsRunning(savedIsRunning === "true");
        if (savedState)
            setTimerState(savedState as "focus" | "break" | "paused");
        if (savedCycles) setCycleCount(parseInt(savedCycles, 10));
        if (savedTag) setTag(savedTag);
    }, []);

    useEffect(() => {
        localStorage.setItem("timer-time", time.toString());
        localStorage.setItem("timer-isRunning", isRunning.toString());
        localStorage.setItem("timer-state", timerState);
        localStorage.setItem("timer-cycles", cycleCount.toString());
        localStorage.setItem("timer-tag", tag);
    }, [time, isRunning, timerState, cycleCount, tag]);

    const Reset = () => {
        var timeSpent = cycleCount * focusTime;
        if (timerState === "focus" || timerState === "paused") {
            timeSpent += focusTime - time;
        } else if (timerState === "break" || timerState === "paused") {
            timeSpent += focusTime;
        }

        if (!session) return;
        console.log(timeSpent, tag, time, cycleCount);

        if (timeSpent && tag) {
            fetch(
                `http://localhost:8000/api/pomodoro/insertfocussessiondata/${session.user.id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.user.token}`,
                    },
                    body: JSON.stringify({
                        subject: tag,
                        timespent: timeSpent,
                        date: new Date().toISOString(),
                    }),
                }
            )
                .then((res) => res.json())
                .then((data) =>
                    toast.success(
                        `You've spent ${formatTimeHours(timeSpent)}s on ${tag}`,
                        { style: { color: "#16a34a" } }
                    )
                )
                .catch((err) => toast.error("Error saving session:", err));
        }
        setIsRunning(false);
        setTimerState("paused");
        setLastActiveState(null);
        setTime(focusTime);
        setTag("Default");
    };

    const Start = () => {
        setIsRunning(true);
        setTimerState("focus");
    };

    const Pause = () => {
        setIsRunning(false);
        setTimerState("paused");
    };

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
                tag,
                setTag,
                Reset,
                Start,
                Pause,
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
