<template>
  <video-js
    :ref="`vp-${video.id}`"
    class="video-js vjs-default-skin vjs-big-play-centered"
    :class="{ 'vjs-fluid': fluid }"
    :poster="video.poster || false"
    controls
    playsinline
    webkit-playsinline
    preload="auto"
    :width="width"
    :height="height"
  >
    <source
      v-for="source in video.sources"
      :key="source.src"
      :src="source.src"
      :type="source.type"
    >
    <p class="vjs-no-js">
      {{ $t('dashboard.signLanguageModal.noVideo') }}
    </p>
  </video-js>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
import 'videojs-contrib-quality-levels'
import 'videojs-http-source-selector'

export default {
  name: 'VideoPlayer',
  props: {
    fluid: {
      type: Boolean,
      default: false
    },
    ratio: {
      type: String,
      default: '16:9'
    },
    width: {
      type: [Number, String],
      default: 1280
    },
    height: {
      type: [Number, String],
      default: 720
    },
    video: {
      type: Object,
      default() {
        return {
          id: '',
          poster: '',
          sources: []
        }
      }
    }
  },
  data() {
    return {
      player: null,
      options: {
        language: this.$i18n.locale,
        userActions: {
          hotkeys: 'true'
        },
        html5: {
          vhs: {
            overrideNative: true,
            smoothQualityChange: true
          },
          nativeAudioTracks: false,
          nativeVideoTracks: false
        },
        plugins: {
          httpSourceSelector: {
            default: 'auto'
          }
        }
      }
    }
  },
  watch: {
    fluid() {
      if (this.fluid) {
        this.player.fluid = true
        this.player.aspectRatio = this.ratio
      } else this.player.fluid = false
    }
  },
  mounted() {
    this.player = videojs(this.$refs[`vp-${this.video.id}`], this.options)
    this.player.reloadSourceOnError()
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
