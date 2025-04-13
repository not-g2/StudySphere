"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function GoogleAuthSuccess() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const sessionData = searchParams.get("session");

        if (sessionData) {
            const decodedSession = JSON.parse(atob(sessionData));
            Cookies.set("session", JSON.stringify(decodedSession), {
                expires: 1, // 1 day
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            router.push("/Dashboard");
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
