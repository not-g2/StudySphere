import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        c1 : '#070F2B',
        c2 : '#1B1A55',
        c3 : '#535C91',
        c4 : '#9290C3',
        // c1 : '#0d1b2a',
        // c2 : '#1b263b',
        // c3 : '#415a77',
        // c4 : '#778da9',
        c5 : '#e0e1dd',
        a1 : '#90E0EF',
        a2 : '#4DFFF3',
        b1 : '#539987',
      },
    },
  },
  plugins: [],
};
export default config;
