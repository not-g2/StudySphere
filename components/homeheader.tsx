"use client";
import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Box,
    IconButton,
    Button,
    Skeleton,
} from "@mui/material";
import Dropdown from "../components/dropdown";
import { useRouter } from "next/navigation";
import LogoutPage from "./signout";
import useSessionCheck from "../app/hooks/auth"; // Use your custom hook
import { useTimer } from "@/context/TimerContext";
import { formatTime } from "@/utils/formatTime";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import Notifications from "./HomeHeader/Notifications";

const skeletonBg = "#001125";

const Header: React.FC = () => {
    const PORT = process.env.NEXT_PUBLIC_PORT;
    const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
        null
    );
    const router = useRouter();
    const [userImage, setUserImage] = useState<string | null>(null);
    const [session, setSession] = useState<any | null | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const [animateBell, setAnimateBell] = useState<boolean>(true);
    const [streak, setstreak] = useState(0);
    const [flameanim, setflameanim] = useState(null);

    useSessionCheck(setSession);

    const navItems = [
        { label: "Home", path: "/" },
        { label: "Dashboard", path: "/Dashboard" },
        { label: "Courses", path: "/Courses" },
        { label: "Rewards", path: "/Rewards" },
        { label: "Goals", path: "/Goals" },
        { label: "Schedule", path: "/Schedule" },
        { label: "Pomodoro", path: "/Pomo" },
    ];

    const { time, isRunning, timerState, lastActiveState } = useTimer();

    const handleGo = (path: string) => {
        router.push(path);
    };

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setProfileAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setProfileAnchorEl(null);
    };

    const handleSignOut = () => {
        setOpen(true);
    };

    useEffect(() => {
        if (!session) return;

        const GetProfile = async () => {
            const token = session.user.token;
            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/desc/profile`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        method: "GET",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    toast.success(`Welcome back ${session.email}`);
                    setUserImage(data.image?.url || "");
                    setstreak(data.streakCount);
                } else {
                    console.error("Failed to fetch profile image");
                }
            } catch (error) {
                console.error("Error fetching profile image:", error);
            }
        };

        GetProfile();
    }, [session]);

    const renderTimer = (): JSX.Element => {
        switch (true) {
            case isRunning && timerState === "focus":
                return (
                    <span className="text-green-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-500 ease-out">
                        {formatTime(time)}
                    </span>
                );
            case !isRunning &&
                timerState === "paused" &&
                lastActiveState != null:
                return (
                    <span className="text-red-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-500 ease-out">
                        {formatTime(time)}
                    </span>
                );
            case isRunning && timerState === "break":
                return (
                    <span className="text-yellow-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-500 ease-out">
                        {formatTime(time)}
                    </span>
                );
            default:
                return <div></div>;
        }
    };

    useEffect(() => {
        fetch("/streakFlame.json")
            .then((res) => res.json())
            .then((data) => setflameanim(data))
            .catch((err) => console.error("Failed to load animation:", err));
    }, []);

    return (
        <AppBar
            position="static"
            sx={{
                background: "#000000",
                paddingX: 2,
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 3 }}>
                    {session === undefined
                        ? navItems.map((item, index) => (
                              <Skeleton
                                  key={index}
                                  variant="text"
                                  width={80}
                                  sx={{ bgcolor: skeletonBg, height: "1rem" }}
                              />
                          ))
                        : navItems.map((item) => (
                              <Typography
                                  key={item.label}
                                  variant="h6"
                                  onClick={() => handleGo(item.path)}
                                  sx={{
                                      color: "#fff",
                                      fontSize: "1rem",
                                      fontWeight: "500",
                                      cursor: "pointer",
                                      "&:hover": {
                                          color: "#ffcc00",
                                          transition: "0.3s ease-in-out",
                                      },
                                  }}
                              >
                                  {item.label}
                              </Typography>
                          ))}
                </Box>

                {/* Timer */}
                <div
                    className="flex justify-end w-full pr-4"
                    onClick={() => router.push("/Pomo")}
                >
                    {renderTimer()}
                </div>

                {/* Right Side: Notifications and Auth Buttons/Profile */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <div className="relative flex items-center justify-center">
                        <Lottie
                            animationData={flameanim}
                            className="w-12 h-12"
                            style={{
                                filter: "hue-rotate(180deg) brightness(1.2) saturate(1.5)",
                            }}
                        />
                        <span className="absolute text-black font-bold text-lg">
                            {streak}
                        </span>
                    </div>

                    <Notifications
                        id={session?.user?.id}
                        token={session?.user?.token}
                    />

                    {session === undefined ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Skeleton
                                variant="rectangular"
                                width={80}
                                height={36}
                                sx={{ bgcolor: skeletonBg }}
                            />
                            <Skeleton
                                variant="rectangular"
                                width={80}
                                height={36}
                                sx={{ bgcolor: skeletonBg }}
                            />
                        </Box>
                    ) : !session ? (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => router.push("/auth/signin")}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => router.push("/auth/signup")}
                            >
                                Sign Up
                            </Button>
                        </>
                    ) : (
                        <>
                            <IconButton onClick={handleProfileClick}>
                                <Avatar
                                    src={userImage ?? "/default-profile.png"}
                                    alt="Profile Picture"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        border: "2px solid white",
                                    }}
                                />
                            </IconButton>

                            <Dropdown
                                anchorEl={profileAnchorEl}
                                handleClose={handleClose}
                                handleSignOut={handleSignOut}
                            />
                            <LogoutPage
                                open={open}
                                setOpen={setOpen}
                                setSession={setSession}
                            />
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
