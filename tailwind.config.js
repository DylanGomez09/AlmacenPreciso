/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  darkMode: "class",
  content: [
    "./app/**/*.{js,tsx,ts,jsx}",
    "./components/**/*.{js,tsx,ts,jsx}",
    "./hooks/**/*.{js,tsx,ts,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1a4a40",
          dark: "#0d2b24",
        },
        "brand-light": "#e0fdf0",
        urgent: {
          bg: "#fce8e6",
          text: "#c62828",
        },
      },
    },
  },
  plugins: [],
};
