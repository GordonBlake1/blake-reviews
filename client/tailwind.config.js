/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Update this path
    "./public/index.html",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "review-bg": "rgb(245, 245, 245)",
      },
      fontFamily: {
        anton: ['"Anton"', "sans-serif"],
        bebas: ['"Bebas Neue"', "sans-serif"],
        roboto: ['"Roboto"', "sans-serif"],
      },
      animation: {
        "color-change": "colorChange 10s linear infinite",
      },
      keyframes: {
        colorChange: {
          "0%": { color: "#5cd557" },
          "20%": { color: "#57c5d5" },
          "40%": { color: "#3764e3" },
          "60%": { color: "#50ff47" },
          "80%": { color: "#f9b622" },
          "100%": { color: "#5cd557" },
        },
      },
    },
  },
  plugins: [],
};
