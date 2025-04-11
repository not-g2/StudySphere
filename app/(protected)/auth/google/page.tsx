"use client";
export const dynamic = "force-dynamic"; // Disable static pre-rendering

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function GoogleAuthSuccess() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const sessionData = searchParams.get("session");

        if (sessionData) {
            try {
                const decodedSession = JSON.parse(atob(sessionData));

                import("js-cookie").then((Cookies) => {
                    Cookies.default.set(
                        "session",
                        JSON.stringify(decodedSession),
                        {
                            expires: 1,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "strict",
                        }
                    );
                    router.push("/Dashboard");
                });
            } catch (err) {
                console.error("Failed to decode or set cookie:", err);
            }
        }
    }, [searchParams]);

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
            }}
        >
            <CircularProgress />
            <Typography variant="h6" color="gray">
                Signing you in with Google...
            </Typography>
        </Box>
    );
}
