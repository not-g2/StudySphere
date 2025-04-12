"use client";
import { ReactNode } from "react";
import "./globals.css";
import "./(protected)/output.css";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}

export default RootLayout;
