"use client";

import Header from "../components/homeheader";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import './output.css'

export default function RootLayout({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}