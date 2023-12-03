// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-icon', '@nuxt/ui'],
  runtimeConfig: {
    auth: {
      name: 'nuxt-session',
      password: 'my-super-secret-password-is-minimum-32-characters-long',
    },
    public: {
      APP_URL: 'http://localhost:3000',
    },
    turso: {
      dbUrl: '',
      dbAuthToken: '',
    },
  },
  imports: {
    dirs: ['stores'],
  },
  ignore: ['data/**/*'],
  ui: {
    icons: ['mdi', 'simple-icons', 'heroicons', 'ion'],
  },
  app: {
    head: {
      title: 'Buzz',
      link: [
        { rel: 'alternate icon', type: 'image/png', href: '/logo.png' },
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
      ],
    },
  },
});
