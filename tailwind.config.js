/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        panton: ['Panton-Regular', 'sans-serif'],
        'panton-bold': ['Panton-Bold', 'sans-serif'],
        'panton-semibold': ['Panton-SemiBold', 'sans-serif'],
        'panton-light': ['Panton-Light', 'sans-serif'],
        'panton-italic': ['Panton-Ttalic', 'sans-serif']
      }
    }
  },
  plugins: []
};
