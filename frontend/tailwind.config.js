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
        vc: "0 0px 10px rgba(61, 135, 248, 0.2)",
        vch: "0 0px 10px rgba(61, 135, 248, 0.5)",
      },
      backgroundColor: {
        primary: "#3e97fc",
      },
    },
  },
  plugins: [],
};
