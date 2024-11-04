"use client";
import React, { useEffect, useRef, useState } from "react";
import { getSession, signOut, useSession } from "next-auth/react";
import {
  Button,
  Container,
  Typography,
  Avatar,
  Box,
  Stack,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import default_profile_pic from "../../public/default-profile.png";

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [image, setImage] = useState(session?.user?.image || "");

  useEffect(() => {
    if (status === "authenticated") {
      setName(session?.user?.name || "");
      setEmail(session?.user?.email || "");
      setImage(session?.user?.image || "");
    }

    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Profile:", { name, email, image });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "http://localhost:8000/api/images/upload/profile",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Image uploaded successfully:", data);
        setImage(data.imageUrl || image);
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
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
          src={image || default_profile_pic.src}
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
          Welcome, {session?.user?.name || "User"}
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
            onChange={(e) => setEmail(e.target.value)}
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
            inputProps={{
              maxLength: 10, // Optional max length for phone number format (e.g., (123) 456-7890)
            }}
          />
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" type="submit">
              Update Profile
            </Button>
            <Button variant="outlined" color="error" onClick={() => signOut()}>
              Sign Out
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ProfilePage;
