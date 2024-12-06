<template>
  <b-modal
    centered
    :ok-title="$t('common.gotIt')"
    ok-only
    hide-footer
    id="sign-language-modal"
    :title="$t('dashboard.signLanguageModal.title')"
    data-cy="signLanguageModal"
  >
    <video-player :fluid="true" :video="video"/>
  </b-modal>
</template>

<script>
import VideoPlayer from '@/components/common/VideoPlayer.vue'

export default {
  name: 'SignLanguageModal',
  components: {
    VideoPlayer
  },
  data() {
    return {
      video: {
        id: 'gebaerdenvideo',
        sources: [
          {
            type: 'application/x-mpegURL',
            src: 'https://kultursphaere.sh/videos/sign-language/index.m3u8'
          },
          {
            type: 'video/mp4',
            src: 'https://kultursphaere.sh/videos/sign-language/progressive.mp4'
          }
        ]
      }
    }
  }
}
</script>
<style lang="scss">
.close {
  color: var(--muted);
}

.close:hover, .close:focus {
  color: var(--body-color);
}
</style>
