/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bree: ['"Bree Serif"', 'serif'],
        poppins: ['"Poppins"', 'sans-serif'],
      },
      colors: {
        pinkfigma: '#FF8DFF'
      }
    },
  },
  plugins: [],
}
