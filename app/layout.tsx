"use client";
import { ReactNode } from "react";
import "./globals.css";
import "./(protected)/output.css";
import { TimerProvider } from "@/context/TimerContext";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
const ToastContainer = dynamic(
    () => import("react-toastify").then((mod) => mod.ToastContainer),
    { ssr: false }
);

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
