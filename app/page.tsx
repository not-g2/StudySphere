"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSessionCheck from "./hooks/auth";
import Cookies from "js-cookie";
import "./abc.css";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import PasswordInput from "@/components/SignUp/passwordInput";
const toast = {
    success: (msg: string) =>
        import("react-toastify").then((mod) => mod.toast.success(msg)),
    error: (msg: string) =>
        import("react-toastify").then((mod) => mod.toast.error(msg)),
};

function Page() {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setisAdmin] = useState("User");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (
        event: any,
        newAlignment: React.SetStateAction<string> | null
    ) => {
        if (newAlignment !== null) {
            setisAdmin(newAlignment);
        }
    };

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

    const handleGoogleSignIn = () => {
        router.push("http://localhost:8000/auth/google");
    };

    const handleGitHubSignIn = () => {
        router.push("http://localhost:8000/auth/github");
    };

    useSessionCheck(setSession);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    useEffect(() => {
        const sessionData = Cookies.get("session");
        if (sessionData) {
            window.location.href = "/Dashboard";
        }
    }, [router, setSession]);

    useEffect(() => {
        const signUpButton = document.getElementById("signUp");
        const signInButton = document.getElementById("signIn");
        const container = document.getElementById("container");

        if (signUpButton && signInButton && container) {
            signUpButton.addEventListener("click", () => {
                container.classList.add("right-panel-active");
            });

            signInButton.addEventListener("click", () => {
                container.classList.remove("right-panel-active");
            });
        }

        return () => {
            if (signUpButton && signInButton) {
                signUpButton.removeEventListener("click", () => {
                    container?.classList.add("right-panel-active");
                });

                signInButton.removeEventListener("click", () => {
                    container?.classList.remove("right-panel-active");
                });
            }
        };
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const endpoint =
            isAdmin === "Admin"
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
                    localStorage.setItem("showToast", `Welcome back ${email}`);
                    if (isAdmin === "Admin") {
                        window.location.href = "/admin";
                    } else {
                        window.location.href = "/Dashboard";
                    }
                } else {
                    setError("Login failed: " + data.msg);
                }
            })
            .catch((error) => {
                console.error("An error occurred:", error);
                setError("An error occurred. Please try again.");
            });
    };

    const isValidPassword = (password: string) => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
        return regex.test(password);
    };

    const handleSubmitSignUp = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!isValidPassword(password)) {
            toast.error(
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
            );
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8000/api/auth/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Sign-up failed");
            }

            storeSessionData(data);

            window.location.href = "/Dashboard";
        } catch (err) {
            setError((err as Error).message);
        }
    };
    return (
        <div>
            <div className="container" id="container">
                <div className="form-container sign-up-container">
                    <form action="#">
                        <h1>Create Account</h1>
                        <div className="social-container">
                            <a
                                href="#"
                                className="social"
                                onClick={handleGoogleSignIn}
                            >
                                <img src="/google.svg" />
                                <i className="fab fa-google-plus-g"></i>
                            </a>
                            <a
                                href="#"
                                className="social"
                                onClick={handleGitHubSignIn}
                            >
                                <img src="/github.svg" />
                                <i className="fab fa-github"></i>
                            </a>
                        </div>
                        <span>or use your email for registration</span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div style={{ position: "relative", width: "100%" }}>
                            <PasswordInput
                                password={password}
                                setPassword={setPassword}
                                showPassword={showPassword}
                                togglePasswordVisibility={
                                    togglePasswordVisibility
                                }
                            />
                        </div>

                        <button onClick={(e) => handleSubmitSignUp(e)}>
                            Sign Up
                        </button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form action="#">
                        <h1>Sign in</h1>
                        <div className="social-container">
                            <a
                                href="#"
                                className="social"
                                onClick={handleGoogleSignIn}
                            >
                                <img src="/google.svg" />
                                <i className="fab fa-google-plus-g"></i>
                            </a>
                            <a
                                href="#"
                                className="social"
                                onClick={handleGitHubSignIn}
                            >
                                <img src="/github.svg" />
                                <i className="fab fa-github"></i>
                            </a>
                        </div>
                        <span>or use your account</span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <a href="#">Forgot your password?</a>
                        <ToggleButtonGroup
                            exclusive
                            value={isAdmin}
                            onChange={handleChange}
                            sx={{
                                borderRadius: "50px",
                                backgroundColor: "#f0f0f0",
                                padding: "2px", // Reduced padding
                                maxHeight: "40px", // Adjust height
                                marginBottom: "5px",
                            }}
                        >
                            <ToggleButton
                                value="Admin"
                                sx={{
                                    borderRadius: "50px",
                                    px: 2, // Reduced padding
                                    fontSize: "12px", // Smaller text
                                    minHeight: "26px", // Adjust height
                                }}
                            >
                                Admin
                            </ToggleButton>
                            <ToggleButton
                                value="User"
                                sx={{
                                    borderRadius: "50px",
                                    px: 2, // Reduced padding
                                    fontSize: "12px", // Smaller text
                                    minHeight: "26px", // Adjust height
                                }}
                            >
                                User
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <button onClick={(e) => handleSubmit(e)}>
                            Sign In
                        </button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>
                                To keep connected with us please login with your
                                personal info
                            </p>
                            <button className="ghost" id="signIn">
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>
                                Enter your personal details and start journey
                                with us
                            </p>
                            <button className="ghost" id="signUp">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
