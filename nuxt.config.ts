// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:false,
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', "@nuxt/image", "nuxt-icon",'shadcn-nuxt',],
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
    public: {
      API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL,
      APP_BASE_URL : process.env.NUXT_PUBLIC_APP_BASE_URL,

    }

  },
  routeRules:{
    '/api/**': { cors: true },
    '/' : {redirect : '/overview'},
  },
  imports:{
    dirs:[
      '@/stores/',
      '@/components/ui'
    ]
  },
})