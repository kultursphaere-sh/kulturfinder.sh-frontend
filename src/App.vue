<template>
  <div id="app">
    <template v-if="!loading">
      <keep-alive>
        <router-view class="h-100 d-flex flex-column"/>
      </keep-alive>
      <no-gps-modal/>
      <no-network-modal/>
      <pwa-modal/>
      <ios-pwa-banner v-if="showPWABanner"/>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NoGpsModal from '@/components/common/NoGpsModal.vue'
import NoNetworkModal from '@/components/common/NoNetworkModal.vue'
import PwaModal from '@/components/common/PwaModal.vue'
import IosPwaBanner from '@/components/common/IosPwaBanner.vue'
import { Workbox } from 'workbox-window/Workbox.mjs'

export default {
  name: 'App',
  components: {
    NoGpsModal,
    NoNetworkModal,
    PwaModal,
    IosPwaBanner
  },
  data() {
    return {
      loading: true,
      showPWABanner: false,
      prefersDarkmode: window.matchMedia('(prefers-color-scheme: dark)')
    }
  },
  computed: {
    ...mapGetters({
      institutions: 'institutions/getAll',
      timeout: 'institutions/getTimeout'
    }),
    isIOSSafari() {
      const ua = window.navigator.userAgent
      const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i)
      if (!iOS) return false
      const isBrave = !!(navigator.brave) || false
      const isChrome = !!ua.match(/CriOS/i)
      const isFirefox = !!ua.match(/FxiOS/i)
      return !!ua.match(/Safari/i) && !isBrave && !isChrome && !isFirefox
    },
    isPWA() {
      return window.matchMedia('(display-mode: standalone)').matches
    }
  },
  watch: {
    institutions() {
      if (this.institutions.length > 0) {
        this.loading = false
      }
    },
    timeout(value) {
      if (value) {
        this.loading = false
        this.$router.push(`${this.$i18n.locale}/no-data`)
      }
    },
    loading(value) {
      if (value === false) {
        let loadingScreen = document.getElementById('loadingScreen')
        if (loadingScreen) {
          loadingScreen.style.display = 'none'
        }
      }
    },
    prefersDarkmode(value) {
      if (value !== this.darkmode) {
        this.$store.dispatch('switchColormode')
      }
    }
  },
  mounted() {
    if ('serviceWorker' in navigator) {
      console.log('CHECK_SW')
      const wb = new Workbox('/service-worker.js')
      console.log('WORKBOX', wb)
      wb.addEventListener('controlling', (event) => {
        console.log('RELOAD_SITE')
        window.location.reload(true)
      })
      wb.addEventListener('waiting', (event) => {
        this.$bvModal.msgBoxOk(this.$i18n.t('updateModal.newPwaVersionText'), {
          title: '🎉 ' + this.$i18n.t('updateModal.newPwaVersionTitle'),
          size: 'sm',
          buttonSize: 'sm',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true,
          okVariant: 'success'
        })
          .then(value => {
            console.log('START_SKIPPING')
            wb.messageSW({ type: 'SKIP_WAITING' })
            console.log('SKIPPED')
          })
          .catch(err => {
            console.log('ERROR', err)
          })
      })
      wb.register()
      console.log('EVERYTHING_HOOKED')
    }

    // show pwa banner on mobile safari after 60sec if not pwa
    if (this.isIOSSafari && !this.isPWA) {
      setTimeout(() => {
        if (this.$route.name !== 'arWrapper') this.showPWABanner = true
      }, 20000)
    }

    // sets up to use Dark- or Light-Mode preference (including in Developer Tools)
    if (this.prefersDarkmode.matches) {
      this.$store.dispatch('switchColormode')
    }

    this.prefersDarkmode.addEventListener('change', () => {
      if (this.prefersDarkmode.matches !== this.$store.state.darkmode) {
        this.$store.dispatch('switchColormode')
      }
    })
  }
}
</script>

<style lang="scss">
// Import Bootstrap and Bootstrap-Vue source SCSS files
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';

:root.light {
  --window-bg: #{$window-bg};
  --body-bg: #{$body-bg};
  --body-color: #{$body-color};
  --muted: #{$muted-light};
  --light: #{$light};
  --primary: #{$primary};
  --primary-light: #{$primary-light};
  --secondary: #{$secondary};
  --secondary-light: #{$secondary-light};
  --primary-shadow: #{$primary-shadow};
  --secondary-shadow: #{$secondary-shadow};
  --warning-light: #{$yellow};
}

:root.dark {
  --window-bg: #{$dark-window-bg};
  --body-bg: #{$dark-body-bg};
  --body-color: #{$dark-body-color};
  --muted: #{$muted-dark};
  --light: #{$dark};
  --primary: #{$dark-primary};
  --primary-light: #{$dark-primary-light};
  --secondary: #{$dark-secondary};
  --secondary-light: #{$dark-secondary-light};
  --primary-shadow: #{$dark-primary-shadow};
  --secondary-shadow: #{$dark-secondary-shadow};
  --warning-light: #{$yellow-dark};
}

html, body {
  height: 100%;
  width: 100%;
  background-color: var(--window-bg); // background behind page for mobile devices when scrolling beyond border
  color: var(--body-color);
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
}

#app {
  height: 100%;
  width: 100%;
  min-width: 312px;
}

#main-container {
  flex: 1 1 100%;
  overflow-y: auto;
  z-index: 0;
}

#main-content {
  min-height: 100%;
  background-color: var(--light);
  max-width: $breakpoint-lg;
  margin: auto;
}

#main-content.full-width {
  width: 100%;
  max-width: none;
  border: none;
}

a { color: var(--primary) }

a:active, a:hover {
  color: var(--primary-light);
  text-decoration: none;
}

// header title
h1 {
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

// page title like institutiton name one details page
h2 {
  font-size: 1.4rem;
  color: var(--primary);
}

// section titles
h3 {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--body-color);
}

// institutions list/map header-buttons
h6 {
  display: inline;
  margin: 0.1rem 0 0.1rem 0;
  font-size: 0.8rem;
  font-weight: 500;
}

// labeled button for header
.labeled-button {
  margin-top: 2px;
  display: flex;
  flex-direction: column;
}

// the label of the labeled header button
.labeled-button-label {
  font-size: 0.7rem;
  font-weight: 400;
  margin-bottom: 0;
  cursor: pointer;
}

//makes Line visible regardless of Color-Mode
hr {
  margin-right: 4rem;
  margin-left: 4rem;
  background-color: rgba(0 0 0 / 0.1);
}

.rounded { border-radius: 7px; }

.text-body { color: var(--body-color) !important }

.text-muted { color: var(--muted) !important }

.bg-light, a.bg-light:hover {
  background-color: var(--light) !important;
}

// Images that need to switch with the mode
.dark .img-light, .light .img-dark {
  display: none !important;
}

// Button with transparent BG, primary Text and secondary hover/focus-shadow
.btn-themed {
  background-color: transparent;
  color: var(--primary);
  border: none !important;
}

.btn-themed:hover { color: var(--primary-light) }

.btn-themed:focus,
.btn-themed.focus {
  box-shadow: 0 0 0 0.2rem var(--secondary-shadow);
}

.btn-themed:focus:active,
.btn-themed.focus.active {
  background-color: var(--secondary);
}

// Button with transparent BG, secondary Text and primary hover/focus-shadow
.btn-themed-switch {
  background-color: transparent;
  color: var(--secondary);
  border: none !important;
}

.btn-themed-switch:hover { color: var(--secondary-light) }

.btn-themed-switch:focus,
.btn-themed-switch.focus {
  box-shadow: 0 0 0 0.2rem var(--primary-shadow);
}

.btn-themed-switch:active,
.btn-themed-switch.active {
  background-color: var(--primary);
}

// Most common Icon-sizes
.icon { height: 24px }

.icon-18 { height: 18px }

.icon-20 { height: 20px }

.icon-22 { height: 22px }
</style>
