/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'xl': { 'max': '1200px' },
      'lg': { 'max': '1080px' },
      'md-lg': { 'max': '900px' },
      'md': { 'max': '730px' },
      'sm': { 'max': '500px' },
      'xs': { 'max': '400px' },
      '2xs': { 'max': '300px' },
    }
  },
  plugins: [],
}