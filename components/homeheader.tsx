import React, { useEffect, useState } from "react";
import { Avatar, Button } from "@mui/material";
import Dropdown from "../components/dropdown";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LogoutPage from "./signout";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Header: React.FC = () => {
    const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
        null
    );
    const [notificationAnchorEl, setNotificationAnchorEl] =
        useState<null | HTMLElement>(null);
    const router = useRouter();
    const [userImage, setuserImage] = useState<string | null>(null);
    const [session, setSession] = useState<any>(null);
    const [open, setOpen] = useState(false);

    const handleGo = (path: string) => {
        router.push(path);
    };

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation(); // Prevent the event from bubbling
        setProfileAnchorEl(event.currentTarget);
    };

    const handleBellClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation(); // Prevent the event from bubbling
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
        const sessionData: string | undefined = Cookies.get("session");

        if (sessionData) {
            const parsedSession = JSON.parse(sessionData);
            setSession(parsedSession);
        } else {
            console.log("No session cookie found");
        }
    }, []);

    useEffect(() => {
        if (!session) {
            return;
        }

        const GetProfile = async () => {
            const token = session.user.token;

            try {
                const response = await fetch(
                    "http://localhost:8000/api/desc/profile",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        method: "GET",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setuserImage(data.image?.url || "");
                } else {
                    console.error("Failed to fetch profile image");
                }
            } catch (error) {
                console.error("Error fetching profile image:", error);
            }
        };

        GetProfile();
    }, [session]);

    useEffect(() => {
        const handleCookieChange = () => {
            const sessionData: string | undefined = Cookies.get("session");
            if (sessionData) {
                const parsedSession = JSON.parse(sessionData);
                setSession(parsedSession);
            }
        };

        const intervalId = setInterval(handleCookieChange, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <header className="flex items-center justify-between p-4 bg-c1 text-white">
            <div className="flex space-x-4">
                <div
                    onClick={() => handleGo("/")}
                    className="cursor-pointer hover:underline"
                >
                    Home
                </div>
                <div
                    onClick={() => handleGo("/Dashboard")}
                    className="cursor-pointer hover:underline"
                >
                    Dashboard
                </div>
                <div
                    onClick={() => handleGo("/Courses")}
                    className="cursor-pointer hover:underline"
                >
                    Courses
                </div>
                <div
                    onClick={() => handleGo("/Rewards")}
                    className="cursor-pointer hover:underline"
                >
                    Rewards
                </div>
            </div>

            <div className="flex items-center space-x-4">
                {!session ? (
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => router.push("/auth/signin")}
                        >
                            Sign In
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                router.push("/auth/signup");
                            }}
                            sx={{ marginLeft: 1 }}
                        >
                            Sign Up
                        </Button>
                    </div>
                ) : (
                    <div className="relative flex items-center space-x-4">
                        {/* Profile Avatar */}
                        <Avatar
                            src={userImage ?? "/default-profile.png"}
                            alt="Profile Picture"
                            onClick={handleProfileClick}
                            sx={{ width: 40, height: 40, cursor: "pointer" }}
                            className="hover:shadow-lg"
                        />
                        <Dropdown
                            anchorEl={profileAnchorEl}
                            handleClose={handleClose}
                            handleSignOut={handleSignOut}
                        />

                        {/* Logout Dialog */}
                        <LogoutPage
                            open={open}
                            setOpen={setOpen}
                            setSession={setSession}
                        />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
