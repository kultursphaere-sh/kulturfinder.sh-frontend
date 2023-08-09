export default {
  data() {
    return {
      scrollposition: 0
    }
  },
  activated() {
    this.setMainContainerScrollPos(this.scrollposition)
  },
  methods: {
    resetScrollPosition() {
      this.scrollposition = 0
      this.setMainContainerScrollPos(this.scrollposition)
    },
    setMainContainerScrollPos(pos) {
      const mainContainer = document.getElementById('main-container')
      if (mainContainer) mainContainer.scrollTop = pos
    }
  },
  beforeRouteLeave(to, from, next) {
    const mainContainer = document.getElementById('main-container')
    if (mainContainer) this.scrollposition = mainContainer.scrollTop
    next()
  }
}
