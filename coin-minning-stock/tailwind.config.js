/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#25868d", // Add your custom color here
        secondary: "#e5f33d",
      },

      backgroundImage: {
        aboutImage: "url('https://img.freepik.com/premium-photo/close-up-gold-bitcoin-black-background-with-trading-graph_35652-1624.jpg')",
        backgroundOverlay: "linear-gradient(to-bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
      },
    },
  },
  plugins: [],
}