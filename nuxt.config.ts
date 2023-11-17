// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', "@nuxt/image", "nuxt-icon"],
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},

    },

  },
  runtimeConfig: {
    B4A_APP_ID: process.env.NUXT_B4A_APP_ID,
    B4A_API_KEY: process.env.NUXT_B4A_API_KEY,
    MG_API_KEY: process.env.NUXT_MG_API_KEY,
    public: {
      API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL,

    }

  },
  routeRules:{
    '/': { redirect: '/overview' },
    '/api/**': { cors: true },
  },
})