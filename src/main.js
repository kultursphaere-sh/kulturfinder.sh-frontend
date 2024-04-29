import Vue from 'vue'
import VueMatomo from 'vue-matomo'
import VueResource from 'vue-resource'
import App from './App.vue'
import router from './router'
import store from './store/store'
import BootstrapVue from 'bootstrap-vue'
import './registerServiceWorker'
import 'typeface-roboto'
import './icons'
import * as Vue2Leaflet from 'vue2-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import i18n from './i18n'
import VScrollLock from 'v-scroll-lock'
import vueHeadful from 'vue-headful'

Vue.component('vue-headful', vueHeadful)

Vue.config.productionTip = false

/* prevent unknown custom element error */
Vue.config.ignoredElements = [
  'video-js',
  'a-scene',
  'a-assets',
  'a-entity',
  'a-marker',
  'a-video',
  'a-plane'
]

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

Vue.use(BootstrapVue)
Vue.use(Vue2Leaflet)
Vue.use(VueResource)
Vue.use(VScrollLock)

new Vue({
  router,
  store,
  render: h => h(App),
  i18n,
  async created() {
    /* Start watching gps position only if permission is already granted */
    navigator.permissions.query({ name: 'geolocation' }).then(({ state }) => {
      if (state === 'granted') this.$vuexGeolocation.watchPosition()
    })
  }
}).$mount('#app')

function getCookie(cname) {
  const name = cname + '='
  const ca = document.cookie.split(';')
  ca.forEach(c => {
    while (c.startsWith(' ')) {
      c = c.substring(1)
    }
    if (c.startsWith(name)) {
      return c.substring(name.length, c.length)
    }
  })
  return ''
}

function checkAnalyticsCookie() {
  const analyticsCookie = getCookie('CookieConsent')
  return analyticsCookie !== 'false'
}
if (process.env.VUE_APP_MATOMO === 'true') {
  Vue.use(VueMatomo, {
    // Configure your matomo server and site by providing
    host: 'https://matomo.digicult-verbund.de/',
    siteId: 14,

    // Changes the default .js and .php endpoint's filename
    // Default: 'matomo'
    trackerFileName: 'matomo',

    // Overrides the autogenerated tracker endpoint entirely
    // Default: undefined
    // trackerUrl: 'https://example.com/whatever/endpoint/you/have',

    // Overrides the autogenerated tracker script path entirely
    // Default: undefined
    // trackerScriptUrl: 'https://example.com/whatever/script/path/you/have',

    // Enables automatically registering pageviews on the router
    router: router,

    // Enables link tracking on regular links. Note that this won't
    // work for routing links (ie. internal Vue router links)
    // Default: true
    enableLinkTracking: true,

    // Require consent before sending tracking information to matomo
    // Default: false
    requireConsent: false,

    // Whether to track the initial page view
    // Default: true
    trackInitialView: true,

    // Run Matomo without cookies
    // Default: false
    disableCookies: !checkAnalyticsCookie(),

    // Enable the heartbeat timer (https://developer.matomo.org/guides/tracking-javascript-guide#accurately-measure-the-time-spent-on-each-page)
    // Default: false
    enableHeartBeatTimer: true,

    // Set the heartbeat timer interval
    // Default: 15
    heartBeatTimerInterval: 15,

    // Whether or not to log debug information
    // Default: false
    debug: false,

    // UserID passed to Matomo (see https://developer.matomo.org/guides/tracking-javascript-guide#user-id)
    // Default: undefined
    userId: undefined,

    // Share the tracking cookie across subdomains (see https://developer.matomo.org/guides/tracking-javascript-guide#measuring-domains-andor-sub-domains)
    // Default: undefined, example '*.example.com'
    cookieDomain: '*.kulturfinder.sh',

    // Tell Matomo the website domain so that clicks on these domains are not tracked as 'Outlinks'
    // Default: undefined, example: '*.example.com'
    domains: '*.kulturfinder.sh',

    // A list of pre-initialization actions that run before matomo is loaded
    // Default: []
    // Example: [
    //   ['API_method_name', parameter_list],
    //   ['setCustomVariable','1','VisitorType','Member'],
    //   ['appendToTrackingUrl', 'new_visit=1'],
    //   etc.
    // ]
    preInitActions: []
  })
}
