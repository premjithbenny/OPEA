/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],

  darkMode: "class",

  plugins: [require("flowbite/plugin")],

  theme: {
    extend: {
      colors: {
        /* 🔶 BRAND COLORS */
        primary: "#FF6A00",        // Orange
        primaryHover: "#E65C00",

        /* 🔵 BACKGROUND */
        darkBlue: "#0B1F3A",
        darkBlueLight: "#132B4F",

        /* ⚪ TEXT */
        textPrimary: "#FFFFFF",
        textSecondary: "#9CA3AF",

        /* 🧊 UI */
        borderDark: "#374151",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      boxShadow: {
        premium: "0 10px 30px rgba(0,0,0,0.4)",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
};

module.exports = config;
