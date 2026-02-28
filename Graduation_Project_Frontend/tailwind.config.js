/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E8F5E8",
          100: "#E4F3E5",
          200: "#E1F2E2",
          300: "#DDF0DE",
          400: "#DAEEDB",
          500: "#D6EDD7",
          600: "#D3EBD4",
          700: "#CFE9D0",
          800: "#CCE8CD",
          900: "#C8E6C9",
        },
        DarkGreen: "#667E68FF",
        MainTextColor:"#151915FF",
        textColor:"#546454FF"

      },
    },
  },
  plugins: [],
};
