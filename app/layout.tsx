"use client";
import { ReactNode, useEffect, useState } from "react";
import "./globals.css";
import "./(protected)/output.css";
import { TimerProvider } from "@/context/TimerContext";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <TimerProvider>
        <html lang="en">
            <body>{children}</body>
        </html>
        </TimerProvider>
    );
}
