// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      meta: [
        { hid: 'description', name: 'description', content: "Monitor your water consumption with ease." },
        // Add more meta tags as needed
        { hid: 'og:title', property: 'og:title', content: "Smart Flow | Dashboard" },
        { hid: 'og:description', property: 'og:description', content: "Monitor your water consumption and devices with ease." },
        { hid: 'og:image', property: 'og:image', content: '/logo.png' },
      ]
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', "@nuxt/image", "nuxt-icon", 'shadcn-nuxt',],
  spaLoadingTemplate: 'spa-loading-template.html',
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
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
    B4A_MASTER_KEY: process.env.NUXT_B4A_MASTER_KEY,
    MG_API_KEY: process.env.NUXT_MG_API_KEY,
    INFLUX_SERVER_BASE_URL: process.env.NUXT_INFLUX_SERVER_BASE_URL,
    API_BASE_URL: process.env.NUXT_API_BASE_URL,
    PAYSTACK_BEARER_TOKEN: process.env.NUXT_PAYSTACK_BEARER_TOKEN,
    public: {
      API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL,
      APP_BASE_URL: process.env.NUXT_PUBLIC_APP_BASE_URL,

    }

  },
  routeRules: {
    '/api/**': { cors: true },
    '/billing/invoice/**': { ssr: true },
    '/': { redirect: '/overview' },
  },
  imports: {
    dirs: [
      '@/stores/',
      '@/components/ui'
    ]
  },
})