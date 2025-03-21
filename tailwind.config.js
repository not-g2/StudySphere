/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
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
        },
    },
    plugins: [],
};
