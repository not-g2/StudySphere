import { ReactNode } from "react";
import "./globals.css";
import "./(protected)/output.css";
import "react-toastify/dist/ReactToastify.css";
import Providers from "./providers";

export const metadata = {
    title: "StudySphere",
    description: "Your all-in-one study companion",
};

function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}

export default RootLayout;
