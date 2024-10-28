"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

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
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}