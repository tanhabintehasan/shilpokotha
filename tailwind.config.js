/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          red: "#AE5D69",     // Primary brand color
          black: "#111111",   // Headings / footer
          beige: "#D8BFA3",   // Jute / natural background
          clay: "#B89B7A",    // Secondary accents
          ivory: "#FAF8F5",   // Main background
          gray: "#6B6B6B",    // Muted text
          gold: "#C9A24D",    // Accent (ratings, offers)
        },
      },
    },
  },
  plugins: [],
};
