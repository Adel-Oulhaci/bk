/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-green-white": "linear-gradient(#fff,#eefcfa)",
      },
      backgroundClip: {
        text: "text",
      },
      colors: {
        "dark-one7": "#0b0b0b",
        "gray-one7": "#262626",
        "green-bk": "#2B9D8F",
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities(
        {
          ".bg-gradient": {
            "background-image": theme("backgroundImage.gradient-green-white"),
          },
        },
        ["responsive"]
      );
    },
  ],
};
