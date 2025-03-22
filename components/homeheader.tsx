"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  MenuItem,
  Menu,
  Badge,
  Divider,
  Skeleton,
} from "@mui/material";
import Dropdown from "../components/dropdown";
import { useRouter } from "next/navigation";
import LogoutPage from "./signout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { motion } from "framer-motion";
import useSessionCheck from "../app/hooks/auth"; // 👈 Use your custom hook
import { useTimer } from "@/context/TimerContext";
import { formatTime } from "@/utils/formatTime";

const Header: React.FC = () => {
  const PORT = process.env.NEXT_PUBLIC_PORT;
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const [userImage, setUserImage] = useState<string | null>(null);
  // Start with undefined so we know when the session check is in progress.
  const [session, setSession] = useState<any | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<number>(3);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [animateBell, setAnimateBell] = useState<boolean>(true);

  // This hook sets session to an object if logged in, or null if not logged in, leaving it undefined while checking.
  useSessionCheck(setSession);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/Dashboard" },
    { label: "Courses", path: "/Courses" },
    { label: "Rewards", path: "/Rewards" },
    { label: "Goals", path: "/Goals" },
    { label: "Schedule", path: "/Schedule" },
  ];

    const { time, isRunning, timerState, lastActiveState } = useTimer();

    const handleGo = (path: string) => {
        router.push(path);
    };

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setProfileAnchorEl(event.currentTarget);
    };

    const handleBellClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setProfileAnchorEl(null);
        setNotificationAnchorEl(null);
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
                    setUserImage(data.image?.url || "");
                } else {
                    console.error("Failed to fetch profile image");
                }
            } catch (error) {
                console.error("Error fetching profile image:", error);
            }
        };

        GetProfile();
    }, [session]);

    const markAsRead = () => {
        setNotifications(0);
        setAnimateBell(false);
        handleClose();
    };

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

    return (
        <AppBar
            position="static"
            sx={{
                background:
                    "linear-gradient(to bottom right, #0f173a, #001d30)",
                paddingX: 2,
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 3 }}>
                    {navItems.map((item) => (
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

                <div
                    className="flex justify-end w-full pr-4"
                    onClick={() => router.push("/Pomo")}
                >
                    {renderTimer()}
                </div>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton color="inherit" onClick={handleBellClick}>
                        <Badge badgeContent={notifications} color="error">
                            <motion.div
                                animate={
                                    animateBell
                                        ? { rotate: [0, -10, 10, -10, 10, 0] }
                                        : {}
                                }
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                    repeat: animateBell ? Infinity : 0,
                                    repeatDelay: 2,
                                }}
                            >
                                <NotificationsIcon />
                            </motion.div>
                        </Badge>
                    </IconButton>

                    <Menu
                        anchorEl={notificationAnchorEl}
                        open={Boolean(notificationAnchorEl)}
                        onClose={handleClose}
                        sx={{ mt: 1 }}
                    >
                        {notifications > 0 ? (
                            <>
                                <MenuItem onClick={handleClose}>
                                    New Comment on your post
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    Assignment Due Tomorrow
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    Weekly Challenge is Live!
                                </MenuItem>
                                <Divider />
                                <MenuItem>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={markAsRead}
                                    >
                                        Mark as Read
                                    </Button>
                                </MenuItem>
                            </>
                        ) : (
                            <MenuItem>No new notifications</MenuItem>
                        )}
                    </Menu>

                    {!session ? (
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
