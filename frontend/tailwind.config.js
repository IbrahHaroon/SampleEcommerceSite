/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#030303",
        accent: "#f5f5f5",
        gradientTop: "#3d3d3d",
        gradientBottom: "#939393",
      },
      fontFamily: {
        sans: ['"Space Grotesk"', "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
