<template>
  <div id="ar-wrapper">
    <iframe
      :src="`https://kultursphaere.sh/living-images/index.html?locale=${$route.params.locale}&id=${actId}&time=${Date.now()}`"
      allow="camera"
      width="100%"
      height="100%"
      id="ar-wrapper"
      v-if="active"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import detectRTC from 'detectrtc'

export default {
  name: 'ArWrapper',
  data() {
    return {
      active: false,
      actId: ''
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    listType: {
      type: String,
      default: 'list'
    }
  },
  computed: {
    ...mapGetters({
      filter: 'filters/getFilterQuery'
    })
  },
  methods: {
    iframeBackHandler(msg) {
      if (msg.origin !== 'https://kultursphaere.sh') return

      if (msg.data === 'back-button-clicked') {
        this.$router.push({ name: 'details', query: this.filter, params: { actId: this.actId, listType: this.listType, locale: this.$route.params.locale } })
      }
    }
  },
  async activated() {
    // check if WebRTC supported
    if (!detectRTC.isWebRTCSupported) {
      this.$router.push(`/${this.$route.params.locale}/institutions/${this.listType}/details/${this.actId}#living-images-info`)
    }

    const actIdRegex = /^act[0-9]{6,7}$/
    let id = this.id
    if (id && !this.id.match(actIdRegex)) {
      const res = this.$store.getters['institutions/getActIdByTitle'](id)
      if (!res) {
        await this.$store.dispatch('institutions/fetchDetails', { id: this.id })
          .then((institution, error) => {
            if (institution) id = institution.id
            if (institution && institution.hasDetails === false) this.$bvModal.show('no-network-modal')
          })
      }
      id = res || id
    }
    if (!id) {
      this.$router.push({ name: '404' })
      console.log('404 - Wrong ID, no such institution')
      return
    }
    this.actId = id

    this.active = true

    // listen for messages from iFrame
    window.addEventListener('message', this.iframeBackHandler)
  },
  deactivated() {
    this.active = false
    // Remove listener from iFrame
    window.removeEventListener('message', this.iframeBackHandler)
  }
}
</script>

<style scoped>
iframe {
  border: 0;
}
</style>
