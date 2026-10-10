/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './gemelos-digitales/*.html', './casos/*/*.html', './privacidad/*.html', './gracias/*.html', './servicios/*/*.html', './proteccion-datos-personales/*.html'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
}
