"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { ReactNode } from "react";
import "./globals.css";
import "./(protected)/output.css";
import { TimerProvider } from "@/context/TimerContext";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

function RootLayout({ children }: { children: ReactNode }) {
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

export default dynamic(() => Promise.resolve(RootLayout), { ssr: false });
