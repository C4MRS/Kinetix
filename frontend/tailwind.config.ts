import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
        },
        tertiary: {
          DEFAULT: "var(--color-tertiary)",
          hover: "var(--color-tertiary-hover)",
        },
        background: "var(--color-background)",
        text: "var(--color-text)",
      },
    },
  },
  plugins: [],
};

export default config;
