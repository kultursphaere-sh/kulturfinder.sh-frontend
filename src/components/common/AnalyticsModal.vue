<template>
  <transition appear name="slide">
    <div id="analytics-modal" v-if="showAnalyticsModal" class="bg-white w-100 shadow px-3">
      <b-container id="analytics-container" class="py-3">
        <b-row>
          <div class="ios-pwa-info-text col-sm-12 p-0 d-flex flex-column justify-between">
            <p>{{ $t('common.analyticsTitle') }}</p>
            <span class="">{{ $t('common.analyticsDescription') }}</span>
          </div>
          <div class="analytics-buttons col-12 p-0 mb-2 d-flex justify-around">
            <b-button
              variant="secondary"
              class="mr-3 border-primary text-primary"
              @click="denyConsent()"
            >
              {{ $t('common.analyticsDeny') }}
            </b-button>
            <b-button
              variant="primary"
              class=""
              @click="acceptConsent()"
            >
              {{ $t('common.analyticsAccept') }}
            </b-button>
          </div>
          <span class="">{{ $t('common.analyticsDescription2') }}
            <router-link :to="`/${$route.params.locale}/about`">
              {{ $t("navbar.legalNotice") }}
            </router-link>
          </span>
        </b-row>
        <b-button
          size="sm"
          id="analytics-banner-close-icon"
          variant="secondary"
          pill
          @click="showAnalyticsModal = false"
        >
          <icon-base
            title="Schließen"
            width="14"
            height="14"
            color="#000000"
          >
            <icon-close/>
          </icon-base>
        </b-button>
      </b-container>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AnalyticsModal',
  data() {
    return {
      showAnalyticsModal: true
    }
  },
  methods: {
    acceptConsent() {
      const expireDate = new Date()
      expireDate.setTime(expireDate.getTime() + (50 * 365 * 24 * 60 * 60 * 1000))
      document.cookie = 'CookieConsent=true; expires=' + expireDate.toUTCString() + '; path=/;'
      window.location.reload(true)
      this.showAnalyticsModal = false
    },
    denyConsent() {
      // Create Deny Cookie
      // Create until the end of the browsersession for now
      document.cookie = 'CookieConsent=false; expires=; path=/;'
      // window._paq.push(['disableCookies'])
      this.showAnalyticsModal = false
    }
  }
}
</script>

<style lang="scss" scoped>
#analytics-modal{
  position:fixed;
  bottom: 0;
  z-index: 1000;
}
#analytics-container{
  position:relative;
  height: 100%;
}
#analytics-banner-close-icon{
  position:absolute;
  right:0;
  top:7px;
}
#analytics-logo{
  height: 40px;
}
span,p{
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}
p{
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s ease-in-out;
}
.slide-enter {
  transform: translateY(40px);
}
.slide-leave-to{
  transform: translateY(130px);
}
</style>
