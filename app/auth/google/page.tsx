"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import useSessionCheck from "../../../hooks/auth";

export default function GoogleAuthSuccess() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [session, setSession] = useState(null);

    // Use your custom hook to manage session state
    useSessionCheck(setSession);

    useEffect(() => {
        const sessionData = searchParams.get("session");

        if (sessionData) {
            const decodedSession = JSON.parse(atob(sessionData));
            Cookies.set("session", JSON.stringify(decodedSession), {
                expires: 1, // 1 day
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            router.push("/");
        }
    }, [searchParams]);

    return <p>Redirecting...</p>;
}
