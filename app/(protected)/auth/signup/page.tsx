"use client";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

const SignUpPage: React.FC = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Sign-up failed");
      }

      Cookies.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#001D3D",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "#001D3D",
          color: "#FFFFFF",
          width: "100%",
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            marginTop: 8,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ color: "#FFFFFF" }}>
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, color: "#FFFFFF" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  sx={{
                    "& .MuiInputBase-input": { color: "#FFFFFF" }, // Text color
                    "& .MuiInputLabel-root": { color: "#FFFFFF" }, // Label color
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      { borderColor: "#FFFFFF" }, // Border color
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      { borderColor: "#FFFFFF" }, // Hover border color
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      { borderColor: "#FFFFFF" }, // Focused border color
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  sx={{
                    "& .MuiInputBase-input": { color: "#FFFFFF" }, // Text color
                    "& .MuiInputLabel-root": { color: "#FFFFFF" }, // Label color
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      { borderColor: "#FFFFFF" }, // Border color
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      { borderColor: "#FFFFFF" }, // Hover border color
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      { borderColor: "#FFFFFF" }, // Focused border color
                  }}
                />
              </Grid>
            </Grid>
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SignUpPage;
