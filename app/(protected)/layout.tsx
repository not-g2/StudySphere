"use client";

import Header from "../../components/homeheader";
import AdminHeader from "../../components/adminheader";
import { ReactNode } from "react";
import { TimerProvider } from "@/context/TimerContext";
import "./output.css";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
function RootLayout({
    children,
    session,
}: {
    children: ReactNode;
    session: any;
}) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith("/admin");
    const isAuthRedirect =
        pathname.startsWith("/auth/google") ||
        pathname.startsWith("/auth/github");

    return (
        <div>
            <TimerProvider>
                {!isAuthRedirect &&
                    (isAdminRoute ? <AdminHeader /> : <Header />)}
                {children}
            </TimerProvider>
        </div>
    );
}

export default dynamic(() => Promise.resolve(RootLayout), { ssr: false });
