/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./types.ts"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB7C5', // Chiikawa Pink
        secondary: '#89CFF0', // Hachiware Blue
        accent: '#FFFFA1', // Usagi Yellow
        background: '#FDFDF5', // Paper Texture
        navy: '#5D4037', // Coffee Brown
        sakura: '#FFD1DC',
      },
      fontFamily: {
        sans: ['"Zen Maru Gothic"', '"Kosugi Maru"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}