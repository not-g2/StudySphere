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

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {isAdminRoute ? <AdminHeader /> : <Header />}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
