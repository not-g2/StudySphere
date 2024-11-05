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

  const [name, setName] = useState("User");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");

  const [imageFile, setimageFile] = useState<File | null>(null);

  const formDataDetails = new FormData();
  const formDataImage = new FormData();

  useEffect(() => {
    const GetProfile = async () => {
      if (status === "authenticated") {
        const token = session?.accessToken;

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
            console.log(data);
            setName(data.name || "");
            setEmail(data.email || "");
            setImage(data.image?.url || "");
            setphoneNumber(data.phoneNumber || "");
          } else {
            console.error("Failed to upload image");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      } else if (status === "unauthenticated") {
        router.push("/");
      }
    };

    GetProfile();
  }, [status, session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    const formDataToJson = (formData: FormData) => {
      const obj: { [key: string]: any } = {};
      formData.forEach((value, key) => {
        obj[key] = value;
      });
      return JSON.stringify(obj);
    };

    e.preventDefault();
    const token = session?.accessToken;

    formDataDetails.set("name", name);
    formDataDetails.set("phoneNumber", phoneNumber);

    if (imageFile) {
      formDataImage.set("profilePic", imageFile); // Append the image file
    } else {
      formDataImage.set("profilePic", "");
    }

    try {
      const response = await fetch("http://localhost:8000/api/desc/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: formDataToJson(formDataDetails),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error("Failed to upload Profile Deatils");
      }
    } catch (error) {
      console.error("Error uploading Profile:", error);
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/desc/profile/upload",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Keep Authorization header only
          },
          method: "POST",
          body: formDataImage, // `formDataImage` should be a FormData object
        }
      );
      if (response.ok) {
        const data = await response.json();
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
            value={phoneNumber}
            onChange={(e) => setphoneNumber(e.target.value)}
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
