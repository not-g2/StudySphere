import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                darkbg: "#1A1A1A",
                background: "var(--background)",
                foreground: "var(--foreground)",
                c1: "#000814",
                c2: "#001D3D",
                c3: "#4381C1",
                c4: "#C7E8F3",
                // c1 : '#0d1b2a',
                // c2 : '#1b263b',
                // c3 : '#415a77',
                // c4 : '#778da9',
                c5: "#012E5E",
                a1: "#90E0EF",
                a2: "#4DFFF3",
                b1: "#539987",
                t1: "#A4B494",
                t2: "#033B78",
            },
            animation: {
                "border-pulse": "borderPulse 1.5s infinite ease-in-out",
            },
            keyframes: {
                borderPulse: {
                    "0%": { boxShadow: "0 0 0 2px rgba(34, 197, 94, 0.5)" },
                    "50%": { boxShadow: "0 0 10px 4px rgba(34, 197, 94, 1)" },
                    "100%": { boxShadow: "0 0 0 2px rgba(34, 197, 94, 0.5)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
