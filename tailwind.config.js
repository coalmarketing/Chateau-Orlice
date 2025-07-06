/** @type {import('tailwindcss').Config} */
import fluid, { extract, fontSize, screens } from 'fluid-tailwind'
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: "selector",
  content: {
    files: ["./src/**/*.{html,njk,js}"],
    extract,
  },
  theme: {
    fontSize: fontSize,
    screens: screens,
    extend: {
      fontFamily: {
        "sans": ["Sigurd", defaultTheme.fontFamily.serif],
        "jakarta-sans": ["Plus Jakarta Sans", defaultTheme.fontFamily.sans],
        "trirong": ["Trirong", defaultTheme.fontFamily.serif]
      },
      colors: {
        "ochre": "#1E1E1C",
        "cream": "#F0ECE1",
        "gold": "#B99663"
      }
    },
    container: {
      screens: {
        sm: '40rem',     // 640px
        md: '48rem',     // 768px
        lg: '64rem',     // 1024px
        xl: '80rem',     // 1280px
        '2xl': '90rem',  // 1440px
      },
    },
  },
  plugins: [
    fluid,
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
  ],
}