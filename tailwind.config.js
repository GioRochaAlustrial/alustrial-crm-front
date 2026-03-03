/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          200: "#B0E0F0",
          500: "#0090D0",
          sidebar: "#0077b6",
        },
      },
    },
  },
  plugins: [],
}