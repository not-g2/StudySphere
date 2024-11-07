"use client";

import { useState } from "react";
import {
    Button,
    Container,
    TextField,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const storeSessionData = (responseData: any) => {
    const sessionData = {
        user: {
            id: responseData.user.id,
            token: responseData.token,
        },
        email: responseData.user.email,
        isAdmin: responseData.user.isAdmin,
    };

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    Cookies.set("session", JSON.stringify(sessionData), {
        expires: expirationDate, // expires in 1 hour
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
};

const SignInPage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [email, setEmail] = useState(""); // State for email
    const [password, setPassword] = useState(""); // State for password
    const [error, setError] = useState<string | null>(null); // For error messages
    const [loading, setLoading] = useState(false); // For loading state
    const router = useRouter();

    const toggleSignInMode = () => {
        setIsAdmin(!isAdmin);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null); // Reset error on each submit

        const endpoint = isAdmin
            ? "http://localhost:8000/api/adminauth/login"
            : "http://localhost:8000/api/auth/login";

        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    storeSessionData(data);
                    router.push("/");
                } else {
                    setError("Login failed: " + data.msg);
                }
            })
            .catch((error) => {
                console.error("An error occurred:", error);
                setError("An error occurred. Please try again.");
            })
            .finally(() => {
                setLoading(false); // Reset loading state
            });
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 5,
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                {isAdmin ? "Admin Sign In" : "User Sign In"}
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 3, width: "100%" }}
            >
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                    margin="normal"
                    value={email} // Controlled value
                    onChange={(e) => setEmail(e.target.value)} // Update email state
                />

                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    required
                    margin="normal"
                    value={password} // Controlled value
                    onChange={(e) => setPassword(e.target.value)} // Update password state
                />

                {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : isAdmin ? (
                        "Sign in as Admin"
                    ) : (
                        "Sign in as User"
                    )}
                </Button>
            </Box>

            <Button
                onClick={toggleSignInMode}
                variant="text"
                color="secondary"
                sx={{ mt: 2 }}
            >
                Switch to {isAdmin ? "User" : "Admin"} Sign In
            </Button>
        </Container>
    );
};

export default SignInPage;
