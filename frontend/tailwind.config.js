/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {},
    colors:{
      'blue':'#176B87',
      'light-blue':'#3a7ca5',
      'lighter-blue':'#d7e7fc',
      'almost-blue' : '#e8f2fa',
      'lightest-blue':'#EEF5FF',
      'dark':'#151f27',
      'grey':'#202e39',
      'white':'#f0f0fa',
      'lght-blue':'#0084ff',
      'red':'#8E1616',
    },
    fontFamily: {
      sans: ["'HK Grotesk'", "sans"],
      iter: ["'Inter'", "sans-serif"],
    },
  },
  plugins: [],
}

