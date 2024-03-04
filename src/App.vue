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
      showPWABanner: false
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
  }
}
</script>

<style lang="scss">
// Import Bootstrap and Bootstrap-Vue source SCSS files
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';

html, body {
  height: 100%;
  width: 100%;
  background-color: $gray; // background behind page for mobile devices when scrolling beyond border
  color: $gray-very-dark;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
}

#app {
  height: 100%;
  width: 100%;
  min-width: 312px;
  background-color: $background;
}

#main-container {
  flex: 1 1 100%;
  overflow-y: auto;
  z-index: 0;
}

#main-content {
  min-height: 100%;
  background-color: #fff;
  max-width: $breakpoint-lg;
  margin: auto;
}

#main-content.full-width {
  width: 100%;
  max-width: none;
  border: none;
}

a {
  color: $primary;
}

a:active, a:hover {
  color: $primary-light;
  text-decoration: none;
}

// header title
h1 {
  color: $primary;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

// page title like institutiton name one details page
h2 {
  font-size: 1.4rem;
  color: $primary
}

// section titles
h3 {
  font-size: 1.2rem;
  font-weight: 500;
  color: $gray-very-dark;
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
  color: $primary;
  cursor: pointer;
}

hr {
  margin-right: 4rem;
  margin-left: 4rem;
}
</style>
