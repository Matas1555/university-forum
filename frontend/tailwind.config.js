/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '0.65rem',
        'xxxs': '0.5rem',
        'md2': '0.9rem',
      },
      colors:{
        'blue':'#176B87',
        'light-blue':'#3a7ca5',
        'lighter-blue':'#d7e7fc',
        'almost-blue' : '#e8f2fa',
        'lightest-blue':'#EEF5FF',
        'dark':'#151f27',
        'grey':'#202e39',
        'light-grey':'#687682',
        'lighter-grey':'#9fabb5',
        'white':'#f0f0fa',
        'lght-blue':'#0084ff',
        'red':'#de4343',
        'green':'#27cf15',
        'purple':'#9416d9',
        'orange':'#f08e1f',
        'yellow':'#e6df19'
  
      },
    },
    fontFamily: {
      grotesk: ["'Hanken Grotesk'", "sans-serif"],
      iter: ["'Inter'", "sans-serif"],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities }) {
      const newUtilities = {
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

