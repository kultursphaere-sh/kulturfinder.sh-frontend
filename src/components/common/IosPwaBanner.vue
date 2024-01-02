<template>
  <transition appear name="slide">
    <div
      id="ios-pwa-banner"
      v-if="iosBanner && ios"
      class="bg-white w-100 shadow"
    >
      <!-- ios && iosBanner -->
      <b-container id="ios-pwa-banner-container">
        <b-row>
          <img
            :alt="$t('navbar.logo')"
            id="ios-pwa-logo"
            :src="'/' + tenant + '/img/icons/app-icon.svg'"
            class="mt-3 mx-3"
          >
          <div class="ios-pwa-info-text col-9 mt-3 p-0 d-flex flex-column justify-between">
            <span>{{ $t('pwaBanner.iosPwaClaim') }}</span>
            <p>{{ appName }}</p>
          </div>
        </b-row>
        <b-button
          id="ios-pwa-add-button"
          variant="primary"
          @click="showModal"
        >
          {{ $t('pwaBanner.iosPwaAdd') }}
        </b-button>
        <b-button
          size="sm"
          id="ios-banner-close-icon"
          variant="secondary"
          pill
          @click="iosBanner = false"
        >
          <icon-base
            title="Schließen"
            width="18"
            height="18"
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
  name: 'IosPwaBanner',
  data() {
    return {
      ios: false,
      iosBanner: true
    }
  },
  methods: {
    showModal() {
      this.iosBanner = false
      this.$bvModal.show('pwa-modal')
    }
  },
  computed: {
    tenant: function () { return process.env.VUE_APP_TENANT },
    appName: function () { return process.env.VUE_APP_NAME }
  },
  mounted() {
    this.ios = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  }
}
</script>

<style lang="scss" scoped>
#ios-pwa-banner{
  position:fixed;
  bottom: 0;
  z-index: 1000;
  height: 130px;
  /* max-width: 992px; */
}
#ios-pwa-banner-container{
  position:relative;
  max-width: 500px;
  height: 100%;
}
#ios-banner-close-icon{
  position:absolute;
  right:5px;
  top:5px;
}
#ios-pwa-add-button{
  position: absolute;
  bottom: 20px;
  right:25px;
}
#ios-pwa-logo{
  height: 40px;
}

span,p{
  font-size: 0.8rem;
}
p{
  font-weight: 500;
}
.ios-pwa-headline{
    font-weight: 500;
    // font-size: 1rem;
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
