<template>
  <b-modal
    centered
    scrollable
    ok-only
    :ok-title="$t('common.gotIt')"
    id="pwa-modal"
    ref="pwa-modal"
    :title="$t('common.downloadApp')"
    v-if="!!steps"
  >
    <template v-slot:modal-header class="gps-info">
      <b-row class="gps-info w-100 pt-0 d-flex pl-3 mt-0">
        <icon-base height="26" width="26" color="#509500">
          <icon-download :aria-label="$t('common.downloadApp')"/>
        </icon-base>
        <div class="col-10">
          <h3 class="m-0">{{ $t('common.downloadApp') }}</h3>
        </div>
        <b-button
          variant="link"
          id="header-close-button"
          pill
          @click="hide"
          class="py-0"
        >
          <icon-base
            :title="$t('common.close')"
            width="22"
            height="22"
            role="img"
          >
            <icon-close :aria-label="$t('common.close')"/>
          </icon-base>
        </b-button>
      </b-row>
    </template>
    <b-container>
      <b-row class="mb-4">
        <b-col>
          <span>{{ $t('pwaModal.text') }}</span>
        </b-col>
      </b-row>
      <b-row v-for="(step, i) in steps" :key="i">
        <b-col cols="12">
          <span class="step-text">{{ step.text }}</span>
        </b-col>
        <b-col cols="12">
          <img
            :alt="step.text"
            class="w-100 mt-3 mb-4 rounded"
            :src="step.img"
          >
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import detectRTC from 'detectrtc'

export default {
  name: 'PwaModal',
  computed: {
    steps() {
      return this[detectRTC.osName.toLowerCase()]
    },
    ios() {
      return [
        {
          text: this.$t('pwaModal.iOS.step1'),
          img: require('@/assets/images/pwa-modal/pwa-ios-1.png')
        },
        {
          text: this.$t('pwaModal.iOS.step2'),
          img: require('@/assets/images/pwa-modal/pwa-ios-2.png')
        },
        {
          text: this.$t('pwaModal.iOS.step3'),
          img: require('@/assets/images/pwa-modal/pwa-ios-3.png')
        }
      ]
    },
    android() {
      return [
        {
          text: this.$t('pwaModal.android.step1'),
          img: require('@/assets/images/pwa-modal/pwa-android-1.png')
        },
        {
          text: this.$t('pwaModal.android.step2'),
          img: require('@/assets/images/pwa-modal/pwa-android-2.png')
        },
        {
          text: this.$t('pwaModal.android.step3'),
          img: require('@/assets/images/pwa-modal/pwa-android-3.png')
        }
      ]
    },
    windows() {
      return [
        {
          text: this.$t('pwaModal.windows.step1'),
          img: require('@/assets/images/pwa-modal/pwa-windows-1.jpg')
        },
        {
          text: this.$t('pwaModal.windows.step2'),
          img: require('@/assets/images/pwa-modal/pwa-windows-2.jpg')
        }
      ]
    },
    mac() {
      return [
        {
          text: this.$t('pwaModal.mac.step1'),
          img: require('@/assets/images/pwa-modal/pwa-mac-1.jpeg')
        },
        {
          text: this.$t('pwaModal.mac.step2'),
          img: require('@/assets/images/pwa-modal/pwa-mac-2.jpeg')
        }
      ]
    }
  },
  methods: {
    hide() {
      this.$refs['pwa-modal'].hide()
    }
  }
}
</script>

<style scoped>
  .step-text {
    font-size: 0.9rem;
    color: #565656;
  }
  img {
    border: 1px solid #ccc;
  }
</style>
