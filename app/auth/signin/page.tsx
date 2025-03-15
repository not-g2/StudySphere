"use client";

import { useState } from "react";
import {
    Button,
    Container,
    TextField,
    Typography,
    Box,
    CircularProgress,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";

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
                    if (isAdmin) {
                        router.push("/admin");
                    } else {
                        router.push("/");
                    }
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

    const handleGoogleSignIn = async () => {
        window.location.href = "http://localhost:8000/auth/google";
    };

    const handleGitHubSignIn = async () => {
        window.location.href = "http://localhost:8000/auth/github";
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
                onClick={handleGoogleSignIn}
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ mt: 2, textTransform: "none", fontWeight: "bold" }}
                startIcon={<GoogleIcon />}
            >
                Sign in with Google
            </Button>

            <Button
                onClick={handleGitHubSignIn}
                fullWidth
                variant="outlined"
                color="secondary"
                sx={{ mt: 2, textTransform: "none", fontWeight: "bold" }}
                startIcon={
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                    >
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-1.05-.01-1.91-2.78.58-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.52 1.03 1.52 1.03.89 1.52 2.34 1.08 2.91.83.09-.64.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.8c.85.004 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.83-2.34 4.68-4.57 4.92.36.31.68.91.68 1.84 0 1.33-.01 2.41-.01 2.73 0 .27.18.58.69.48A10.02 10.02 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
                    </svg>
                }
            >
                Sign in with GitHub
            </Button>

            <ToggleButtonGroup
                value={isAdmin ? "admin" : "user"}
                exclusive
                onChange={() => setIsAdmin(!isAdmin)}
                sx={{ mt: 2 }}
            >
                <ToggleButton value="user">User Sign In</ToggleButton>
                <ToggleButton value="admin">Admin Sign In</ToggleButton>
            </ToggleButtonGroup>
        </Container>
    );
};

export default SignInPage;
