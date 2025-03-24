"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Container,
    Typography,
    Avatar,
    Box,
    TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LogoutPage from "@/components/signout";

const ProfilePage: React.FC = () => {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [session, setSession] = useState<any>(null);

    const [name, setName] = useState("User");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [phoneNumber, setphoneNumber] = useState("");

    const [open, setOpen] = useState(false);

    const [imageFile, setimageFile] = useState<File | null>(null);

    const formDataDetails = new FormData();
    const formDataImage = new FormData();

    useEffect(() => {
        const GetProfile = async () => {
            const sessionData: string | undefined = Cookies.get("session");

            if (sessionData && !session) {
                setSession(JSON.parse(sessionData));
            } else if (!sessionData) {
                router.push("/");
            }
            if (session) {
                const token = session?.user.token;

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
                        setName(data.name || "");
                        setEmail(data.email || "");
                        setImage(data.image?.url || "");
                        setphoneNumber(data.phoneNumber || "");
                    } else {
                        console.error("Failed to get details");
                    }
                } catch (error) {
                    console.error("Error Getting profile Details:", error);
                }
            }
        };

        GetProfile();
    }, [session]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = session.user.token;

        formDataDetails.set("name", name);
        formDataDetails.set("phoneNumber", phoneNumber);

        if (imageFile) {
            formDataImage.set("profilePic", imageFile);
        } else {
            formDataImage.set("profilePic", "");
        }

        try {
            const response = await fetch(
                "http://localhost:8000/api/desc/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                    body: JSON.stringify(Object.fromEntries(formDataDetails)),
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error("Failed to upload Profile Details");
            }
        } catch (error) {
            console.error("Error uploading Profile:", error);
        }

        try {
            const response = await fetch(
                "http://localhost:8000/api/desc/profile/upload",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    method: "POST",
                    body: formDataImage,
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error("Failed to upload Profile Image");
            }
        } catch (error) {
            console.error("Error uploading Profile:", error);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setimageFile(file);
        }
    };

    // Handle sign out
    const handleSignOutClick = () => {
        setOpen(true); // Open the confirmation dialog
    };

    return (
        <Container
            maxWidth="sm"
            sx={{ mt: 5, bgcolor: "#001D3D", borderRadius: 2, padding: 4 }}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                bgcolor="background.paper"
                borderRadius={2}
                boxShadow={3}
                p={4}
            >
                <Avatar
                    src={image || "default-profile.png"}
                    alt="Profile Picture"
                    sx={{ width: 120, height: 120, mb: 2, cursor: "pointer" }}
                    onClick={handleImageClick}
                />
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />
                <Typography variant="h5" component="h1" gutterBottom>
                    Welcome, {name || "User"}
                </Typography>
                <form onSubmit={handleUpdateProfile} style={{ width: "100%" }}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        disabled
                        label="Email"
                        type="email"
                        value={email}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        margin="normal"
                        label="Phone Number"
                        type="tel"
                        placeholder="(+91) 12345-67890"
                        fullWidth
                        variant="outlined"
                        value={phoneNumber}
                        onChange={(e) => setphoneNumber(e.target.value)}
                        inputProps={{
                            maxLength: 10,
                        }}
                    />
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="contained" type="submit">
                            Update Profile
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleSignOutClick} // Handle sign out click
                        >
                            Sign Out
                        </Button>
                    </Box>
                </form>
            </Box>
            <LogoutPage open={open} setOpen={setOpen} setSession={setSession} />
        </Container>
    );
};

export default ProfilePage;
