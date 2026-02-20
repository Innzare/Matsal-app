/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        panton: ['Panton-Regular', 'sans-serif'],
        'panton-bold': ['Panton-Bold', 'sans-serif'],
        'panton-semibold': ['Panton-SemiBold', 'sans-serif'],
        'panton-light': ['Panton-Light', 'sans-serif'],
        'panton-italic': ['Panton-Ttalic', 'sans-serif']
      },
      colors: {
        dark: {
          bg: '#121220',
          surface: '#222233',
          elevated: '#252538',
          border: '#2e2e42',
          text: '#e4e4e7',
          muted: '#71717a',
          subtle: '#a1a1aa'
        }
      }
    }
  },
  plugins: []
};
