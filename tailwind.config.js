/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./features/*/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
};
