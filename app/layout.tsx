"use client";
import { ReactNode } from "react";
import "./globals.css";
import "./(protected)/output.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <QueryClientProvider client={queryClient}>
                    {children}
                    <ToastContainer position="bottom-left" autoClose={5000} />
                </QueryClientProvider>
            </body>
        </html>
    );
}

export default RootLayout;
