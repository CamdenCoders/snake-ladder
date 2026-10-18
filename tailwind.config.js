/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily:{
      quicksand: '"Quicksand", "sans-serif"',
      unbounded: '"Unbounded", "sans-serif"',
    },
    
    extend: {
      backdropBlur: {
        sm: '2px',
      }
    },
  },
  plugins: [],
});

