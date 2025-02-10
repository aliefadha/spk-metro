/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primer : "#7E0EFF",
        secunder : "#F6EEFF", 
      }
    },
  },
  plugins: [],
}