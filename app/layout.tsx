"use client";
import { ReactNode } from "react";
import "./globals.css";
import "./(protected)/output.css";
import { TimerProvider } from "@/context/TimerContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <TimerProvider>
            <html lang="en">
                <body>
                    {children}
                    <ToastContainer position="bottom-left" autoClose={5000} />
                </body>
            </html>
        </TimerProvider>
    );
}
