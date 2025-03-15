"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Box,
  IconButton,
  MenuItem,
  Menu,
  Badge,
  Divider,
} from "@mui/material";
import Dropdown from "../components/dropdown";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LogoutPage from "./signout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { motion } from "framer-motion";
import useSessionCheck from "../hooks/auth"; // 👈 Use your custom hook

const Header: React.FC = () => {
  const PORT = process.env.NEXT_PUBLIC_PORT
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<number>(3);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [animateBell, setAnimateBell] = useState<boolean>(true);

  useSessionCheck(setSession); // 👈 using the hook for session management

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
  }, [session]);

  const markAsRead = () => {
    setNotifications(0);
    setAnimateBell(false);
    handleClose();
  };

  return (
    <AppBar
      position="static"
      sx={{ background: "linear-gradient(to bottom right, #0f173a, #001d30)", paddingX: 2 }}
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
                "&:hover": { color: "#ffcc00", transition: "0.3s ease-in-out" },
              }}
            >
              {item.label}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit" onClick={handleBellClick}>
            <Badge badgeContent={notifications} color="error">
              <motion.div
                animate={animateBell ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5, ease: "easeInOut", repeat: animateBell ? Infinity : 0, repeatDelay: 2 }}
              >
                <NotificationsIcon />
              </motion.div>
            </Badge>
          </IconButton>

          <Menu anchorEl={notificationAnchorEl} open={Boolean(notificationAnchorEl)} onClose={handleClose} sx={{ mt: 1 }}>
            {notifications > 0 ? (
              <>
                <MenuItem onClick={handleClose}>New Comment on your post</MenuItem>
                <MenuItem onClick={handleClose}>Assignment Due Tomorrow</MenuItem>
                <MenuItem onClick={handleClose}>Weekly Challenge is Live!</MenuItem>
                <Divider />
                <MenuItem>
                  <Button fullWidth variant="contained" color="primary" onClick={markAsRead}>
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
              <Button variant="contained" color="primary" onClick={() => router.push("/auth/signin")}>
                Sign In
              </Button>
              <Button variant="contained" color="secondary" onClick={() => router.push("/auth/signup")}>
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <IconButton onClick={handleProfileClick}>
                <Avatar
                  src={userImage ?? "/default-profile.png"}
                  alt="Profile Picture"
                  sx={{ width: 40, height: 40, border: "2px solid white" }}
                />
              </IconButton>

              <Dropdown anchorEl={profileAnchorEl} handleClose={handleClose} handleSignOut={handleSignOut} />
              <LogoutPage open={open} setOpen={setOpen} setSession={setSession} />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
