import { ReactNode } from "react";
import "./globals.css";
import "./(protected)/output.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}
                <ToastContainer position="bottom-left" autoClose={5000} />
            </body>
        </html>
    );
}

export default RootLayout;
