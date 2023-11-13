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
        primary : "#68579B",
        secondary : "#00A499"
      },
      backgroundImage: {
        '404': "url('/img/black-kid-enjoying-his-painting.jpg')",
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light']
  },
}

