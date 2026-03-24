import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Hiragino Sans",
          "Hiragino Kaku Gothic ProN",
          "Noto Sans JP",
          "Yu Gothic",
          "Meiryo",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          50: "#f0f2fe",
          100: "#e0e4fd",
          200: "#c3cbfb",
          300: "#96a3f8",
          400: "#7282f9",
          500: "#4f6ef7",
          600: "#3d55d4",
          700: "#3247b5",
          800: "#2a3a93",
          900: "#223076",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
