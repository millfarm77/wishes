import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        nordic: {
          50: "#fbfbfa",
          100: "#f4f4f1",
          200: "#e9e8e2",
          300: "#d7d5cb",
          400: "#b5b19f",
          500: "#928d7a",
          600: "#746f5e",
          700: "#5c574b",
          800: "#4b473e",
          900: "#3e3b34",
          950: "#22201c",
        },
        rose: {
          warm: "#f7eeea",
          accent: "#e07a5f",
        },
        sage: {
          warm: "#edf3f0",
          accent: "#588157",
        },
        sky: {
          warm: "#edf2f7",
          accent: "#3a86ff",
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'float': '0 10px 30px -4px rgba(0, 0, 0, 0.08)',
        'modal': '0 20px 40px -6px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
} satisfies Config;
