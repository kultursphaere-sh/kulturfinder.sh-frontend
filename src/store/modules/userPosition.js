export default {
  namespaced: true,
  state: {},
  getters: {
    getPosition(state, getters, { geolocation }) {
      const { lat, lng } = geolocation

      if (!lat || !lng) return false

      /* Round location coordinates */
      return {
        lat: lat.toFixed(4),
        lng: lng.toFixed(4)
      }
    },
    getError(state, getters, { geolocation }) {
      const { error = {} } = geolocation
      if (!error.code) {
        return false
      }
      console.error('[Error ' + error.code + '] ' + error.message)
      return error
    }
  }
}
