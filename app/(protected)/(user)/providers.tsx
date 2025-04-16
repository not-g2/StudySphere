"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { TimerProvider } from "@/context/TimerContext";

function Providers({ children }: { children: ReactNode }) {
    return <TimerProvider>{children}</TimerProvider>;
}

export default dynamic(() => Promise.resolve(Providers), { ssr: false });
