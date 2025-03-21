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
import useSessionCheck from "../app/hooks/auth"; // Custom hook for session management

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
        const response = await fetch(`http://localhost:${PORT}/api/desc/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        });

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
  }, [session, PORT]);

  const markAsRead = () => {
    setNotifications(0);
    setAnimateBell(false);
    handleClose();
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(to bottom right, #0f173a, #001d30)",
        paddingX: 2,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Navigation: Render skeletons if session is still undefined */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {session === undefined ? (
            navItems.map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                width={80}
                height={30}
                sx={{ bgcolor: "#336699" }}
              />
            ))
          ) : (
            navItems.map((item) => (
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
            ))
          )}
        </Box>

        {/* Right Side: Notification icon and profile avatar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {session === undefined ? (
            // Show skeletons for both notification icon and profile avatar while session is loading.
            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: "#336699" }} />
              <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: "#336699" }} />
            </Box>
          ) : session ? (
            <>
              <IconButton color="inherit" onClick={handleBellClick}>
                <Badge badgeContent={notifications} color="error">
                  <motion.div
                    animate={animateBell ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
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
              <LogoutPage open={open} setOpen={setOpen} setSession={setSession} />
            </>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
