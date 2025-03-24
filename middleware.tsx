import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.endsWith(".json")) {
        return;
    }

    const token = req.cookies.get("session")?.value;
    const pathname = req.nextUrl.pathname;
    const lastPage = req.cookies.get("lastPage")?.value; // Get last visited page

    const res = NextResponse.next();

    if (pathname !== "/") {
        res.cookies.set("lastPage", pathname, { path: "/" });
    }

    if (token && pathname === "/") {
        return NextResponse.redirect(
            new URL(lastPage || "/Dashboard", req.url)
        );
    }
    if (!token && pathname !== "/") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return res;
}

export const config = {
    matcher: [
        "/",
        "/Dashboard",
        "/Courses/:path*",
        "/Rewards",
        "/Goals",
        "/Schedule",
        "/Pomo",
        "/groups",
        "/Profile",
    ],
};
