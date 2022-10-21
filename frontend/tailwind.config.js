/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "src", "./src"],
  theme: {
    fontFamily: {},
    extend: {
      textColor: {
        gray: "#989bad",
      },
    },
  },
  plugins: [],
};
