"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { ReactNode } from "react";
import "./globals.css";
import "./(protected)/output.css";
import { TimerProvider } from "@/context/TimerContext";
import "react-toastify/dist/ReactToastify.css";
import dynamicc from "next/dynamic";
const ToastContainer = dynamicc(
    () => import("react-toastify").then((mod) => mod.ToastContainer),
    { ssr: false }
);

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

export default dynamicc(() => Promise.resolve(RootLayout), { ssr: false });
