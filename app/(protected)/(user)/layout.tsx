"use client";

import Header from "@/components/homeheader";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import Providers from "./providers";

function RootLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-full">
            <Providers>
                <Header />
                {children}
            </Providers>
        </div>
    );
}

export default dynamic(() => Promise.resolve(RootLayout), { ssr: false });
