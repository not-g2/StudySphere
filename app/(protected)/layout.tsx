"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import dynamicc from "next/dynamic";
import Header from "../../components/homeheader";
import AdminHeader from "../../components/adminheader";
import { ReactNode } from "react";
import "./output.css";
import { usePathname } from "next/navigation";
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
            {!isAuthRedirect && (isAdminRoute ? <AdminHeader /> : <Header />)}
            {children}
        </div>
    );
}

export default dynamicc(() => Promise.resolve(RootLayout), { ssr: false });
