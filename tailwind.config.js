/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './gemelos-digitales/*.html', './casos/*/*.html'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
}
