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
    host: '0.0.0.0'
  },
  pwa: {
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
    name: 'Kulturfinder.sh',
    themeColor: '#ffffff',
    msTileColor: '#ffffff',
    appleMobileWebAppStatusBarStyle: 'white',
    iconPaths: {
      favicon32: 'favicon.svg',
      favicon16: 'favicon.svg',
      appleTouchIcon: 'img/icons/apple-icon-152x152.png',
      maskIcon: 'img/icons/app-icon-152x152.png',
      msTileImage: 'img/icons/app-icon-152x152.png'
    },
    manifestOptions: {
      name: 'kulturfinder.sh',
      short_name: 'kulturfinder',
      icons: [
        {
          src: 'img/icons/app-icon-48x48.png',
          type: 'image/png',
          sizes: '48x48'
        },
        {
          src: 'img/icons/app-icon-96x96.png',
          type: 'image/png',
          sizes: '96x96'
        },
        {
          src: 'img/icons/app-icon-128x128.png',
          type: 'image/png',
          sizes: '128x128'
        },
        {
          src: 'img/icons/app-icon-144x144.png',
          type: 'image/png',
          sizes: '144x144'
        },
        {
          src: 'img/icons/app-icon-152x152.png',
          type: 'image/png',
          sizes: '152x152'
        },
        {
          src: 'img/icons/app-icon-192x192.png',
          type: 'image/png',
          sizes: '192x192',
          purpose: 'maskable'
        },
        {
          src: 'img/icons/app-icon-256x256.png',
          type: 'image/png',
          sizes: '256x256'
        },
        {
          src: 'img/icons/app-icon-315x315.png',
          type: 'image/png',
          sizes: '315x315'
        },
        {
          src: 'img/icons/app-icon-384x384.png',
          type: 'image/png',
          sizes: '384x384'
        },
        {
          src: 'img/icons/app-icon-512x512.png',
          type: 'image/png',
          sizes: '512x512'
        },
        {
          src: 'img/icons/app-icon-1024x1024.png',
          type: 'image/png',
          sizes: '1024x1024'
        }
      ],
      start_url: '/',
      display: 'standalone',
      orientation: 'portrait-primary',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      description: '',
      dir: 'ltr',
      lang: 'de-DE'
    }
  }
}
