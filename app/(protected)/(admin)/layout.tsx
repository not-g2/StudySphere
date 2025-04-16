import { ReactNode } from "react";
import Header from "@/components/Adminheader";

function RootLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-full">
            <Header />
            {children}
        </div>
    );
}

export default RootLayout;
