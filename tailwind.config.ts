import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "Arial", "sans-serif"],
      },
      colors: {
        myoga: {
          navy: "#00002e",
          red: "#cc0000",
        },
      },
    },
  },
  plugins: [],
};

export default config;
