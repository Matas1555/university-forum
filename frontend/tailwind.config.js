/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors:{
      'blue':'#176B87',
      'light-blue':'#86B6F6',
      'lighter-blue':'#B4D4FF',
      'lightest-blue':'#EEF5FF',
    }
  },
  plugins: [],
}

