"use client";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <html lang="en">
            <head>
                {/* Import Tailwind CSS only for Dashboard pages */}
                {pathname !== "/" && (
                    <link rel="stylesheet" href="/(protected)/output.css" />
                )}

                {/* Import external CSS only for Sign In page */}
                {pathname === "/" && <link rel="stylesheet" href="/abc.css" />}
            </head>
            <body>{children}</body>
        </html>
    );
}
