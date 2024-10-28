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
      },
    },
  },
  plugins: [],
};
export default config;
