module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/styles/variables.scss";`
      }
    }
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV !== 'production' ? 'eval-source-map' : ''
  },
  productionSourceMap: process.env.NODE_ENV !== 'production',
  pluginOptions: {
    i18n: {
      locale: 'de',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  devServer: {
    https: false,
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://kulturfinder.bremen.de/',
        changeOrigin: true
      }
    }
  },
  pwa: {
    name: process.env.VUE_APP_NAME,
    description: process.env.VUE_APP_DESCRIPTION,
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      cleanupOutdatedCaches: true,
      navigateFallback: '/index.html',
      exclude: [],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/museumsbilder\.digicult-verbund\.de\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'digicult-images',
            expiration: {
              maxAgeSeconds: 86400
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/kultursphaere\.sh\/corsproxy\.php\?url=http:\/\/xtree-actor-api\.digicult-verbund\.de/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'data',
            expiration: {
              maxAgeSeconds: 86400
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    themeColor: '#ffffff',
    msTileColor: '#ffffff',
    appleMobileWebAppStatusBarStyle: 'white',
    iconPaths: {
      favicon32: process.env.VUE_APP_TENANT + '/favicon.svg',
      favicon16: process.env.VUE_APP_TENANT + '/favicon.svg',
      appleTouchIcon: process.env.VUE_APP_TENANT + '/img/icons/apple-icon-152x152.png',
      maskIcon: process.env.VUE_APP_TENANT + '/img/icons/app-icon-152x152.png',
      msTileImage: process.env.VUE_APP_TENANT + '/img/icons/app-icon-152x152.png'
    },
    manifestOptions: {
      name: process.env.VUE_APP_NAME,
      short_name: 'kulturfinder',
      description: process.env.VUE_APP_DESCRIPTION,
      icons: [
        {
          src: process.env.VUE_APP_TENANT + '/img/icons/app-icon-48x48.png',
          type: 'image/png',
          sizes: '48x48'
        },
        {
          src: process.env.VUE_APP_TENANT + '/img/icons/app-icon-96x96.png',
          type: 'image/png',
          sizes: '96x96'
        },
        {
          src: process.env.VUE_APP_TENANT + '/img/icons/app-icon-128x128.png',
          type: 'image/png',
          sizes: '128x128'
        },
        {
          src: process.env.VUE_APP_TENANT + '/img/icons/app-icon-144x144.png',
          type: 'image/png',
          sizes: '144x144'
        },
        {
          src: process.env.VUE_APP_TENANT + '/img/icons/app-icon-152x152.png',
          type: 'image/png',
          sizes: '152x152'
        },
        {
          src: process.env.VUE_APP_TENANT + '/img/icons/app-icon-192x192.png',
          type: 'image/png',
          sizes: '192x192',
          purpose: 'maskable'
        },
        {
          src: process.env.VUE_APP_TENANT + '/img/icons/app-icon-256x256.png',
          type: 'image/png',
          sizes: '256x256'
        },
        {
          src: process.env.VUE_APP_TENANT + '/img/icons/app-icon-512x512.png',
          type: 'image/png',
          sizes: '512x512'
        },
        {
          src: process.env.VUE_APP_TENANT + '/img/icons/app-icon-1024x1024.png',
          type: 'image/png',
          sizes: '1024x1024'
        }
      ],
      start_url: '/',
      display: 'standalone',
      orientation: 'portrait-primary',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      dir: 'ltr',
      lang: 'de-DE'
    }
  }
}
