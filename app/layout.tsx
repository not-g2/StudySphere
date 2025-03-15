"use client";

import Header from "../components/homeheader";
import AdminHeader from "../components/adminheader";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import "./output.css";
import { usePathname } from "next/navigation";

export default function RootLayout({
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
        <html lang="en">
            <body>
                <SessionProvider session={session}>
                    {!isAuthRedirect &&
                        (isAdminRoute ? <AdminHeader /> : <Header />)}
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
