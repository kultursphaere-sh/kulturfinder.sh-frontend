<template>
  <transition name="fade">
    <b-button
      variant="transparent"
      class="scroll-to-top-button bg-light"
      v-if="display"
      @click="scrollToTop"
    >
      <icon-base title="Scroll to top">
        <icon-arrow-up/>
      </icon-base>
    </b-button>
  </transition>
</template>

<script>
export default {
  name: 'ScrollToTopButton',
  data() {
    return {
      display: false
    }
  },
  props: {
    displayHeight: {
      type: [Number, String],
      default: 1000
    }
  },
  methods: {
    scrollToTop() {
      const mainContainer = document.getElementById('main-container')
      if (mainContainer) {
        mainContainer.style.scrollBehavior = 'smooth' // doesn't work for safari (scroll to top button uses this)
        mainContainer.scrollTop = 0
        mainContainer.style.scrollBehavior = 'auto'
      }
    }
  },
  activated() {
    if (this.displayHeight === 0) return
    document.getElementById('main-container').addEventListener('scroll', (e) => {
      if (this.display === false &&
        e.target.scrollTop >= this.displayHeight) this.display = true
      else if (this.display === true &&
        e.target.scrollTop < this.displayHeight) this.display = false
    })
  },
  deactivated() {
    document.getElementById('main-container').removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="scss" scoped>
.scroll-to-top-button {
  width: 40px;
  height: 40px;
  position: fixed;
  bottom: 1.5rem;
  right:  1.5rem;
  padding: 0;
  z-index: 11;
  color: var(--primary) !important;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 1px 5px !important;
}
.scroll-to-top-button:active, .scroll-to-top-button:hover {
  border: 1px solid var(--primary) !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
