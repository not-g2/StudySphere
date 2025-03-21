"use client";
import { ReactNode, useEffect, useState } from "react";
import "./globals.css";
import "./(protected)/output.css";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
