/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors:{
        primary : "#38B6FF",
        secondary : "#00A499",
        pageBg : "#F8F9FC"
      },
      backgroundImage: {
        'headerBg': "url('/bg/header_bg.png')",
        'invoiceBg' : "url('/img/3d-glassy-bent-gradient-cards-and-spheres.png')",
        'invoiceBg-1' : "url('/img/3d-glassy-slides.png')"
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light']
  },
}

