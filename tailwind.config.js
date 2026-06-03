/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  darkMode: "class",
  content: [
    "./app/**/*.{js,tsx,ts,jsx}",
    "./components/**/*.{js,tsx,ts,jsx}",
    "./hooks/**/*.{js,tsx,ts,jsx}",
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#00875A",
          dark: "#006644",
          light: "#E8F5E9",
        },
        "brand-light": "#E8F5E9",
        urgent: {
          bg: "#FEF2F2",
          text: "#DC2626",
        },
        success: {
          DEFAULT: "#10B981",
          bg: "#ECFDF5",
        },
        danger: {
          DEFAULT: "#EF4444",
          bg: "#FEF2F2",
        },
        warning: {
          DEFAULT: "#F59E0B",
          bg: "#FFFBEB",
        },
        coral: {
          DEFAULT: "#F43F5E",
          bg: "#FFF1F2",
        },
        surface: "#F8F9FA",
        muted: "#6B7280",
      },
    },
  },
  plugins: [],
};
