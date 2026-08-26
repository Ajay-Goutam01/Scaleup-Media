/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F9FC",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F0F4F8",
          dark: "#07111F",
          glass: "rgba(255, 255, 255, 0.85)",
        },
        primary: {
          DEFAULT: "#07111F",
          light: "#122033",
          hover: "#0B1B30",
        },
        secondary: {
          DEFAULT: "#667085",
          dark: "#475467",
          light: "#98A2B3",
        },
        accent: {
          DEFAULT: "#08BDF5",
          glow: "rgba(8, 189, 245, 0.25)",
          hover: "#06A4D6",
        },
        brandBlue: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
          dark: "#1D4ED8",
        },
        border: {
          DEFAULT: "#DCE3EA",
          light: "#EDF2F7",
          focus: "#08BDF5",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        display: ["'Outfit'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(7, 17, 31, 0.04), 0 1px 2px rgba(7, 17, 31, 0.02)",
        card: "0 10px 30px -5px rgba(7, 17, 31, 0.05), 0 4px 6px -2px rgba(7, 17, 31, 0.02)",
        "card-hover": "0 20px 40px -10px rgba(7, 17, 31, 0.09), 0 10px 15px -3px rgba(7, 17, 31, 0.04)",
        glow: "0 0 25px rgba(8, 189, 245, 0.35)",
        "glow-lg": "0 0 50px rgba(8, 189, 245, 0.45)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
