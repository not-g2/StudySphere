"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";
import { TimerProvider } from "@/context/TimerContext";

const queryClient = new QueryClient();

function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <TimerProvider>
                {children}
                <ToastContainer position="bottom-left" autoClose={5000} />
            </TimerProvider>
        </QueryClientProvider>
    );
}

export default dynamic(() => Promise.resolve(Providers), { ssr: false });
