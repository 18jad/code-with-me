/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "src", "./src"],
  theme: {
    fontFamily: {},
    extend: {
      textColor: {
        gray: "#989bad",
      },
      dropShadow: {
        wmd: "0 0px 10px rgba(255, 255, 255, 0.6)",
      },
      backgroundColor: {
        primary: "#3e97fc",
      },
    },
  },
  plugins: [],
};
