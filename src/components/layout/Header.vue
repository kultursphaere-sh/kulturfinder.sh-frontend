<template>
  <header id="app-header" :class="{'shadow-sm': shadow}" class="bg-light">
    <div id="header-wrapper" class="bg-light">
      <b-navbar
        id="navbar"
        class="w-100 p-0 align-items-center justify-content-center bg-light"
        type="transparent"
      >
        <div class="left ml-2 ml-lg-1 d-flex">
          <slot name="left">
            <!-- Back Button -->
            <b-button class="backButton" variant="themed" pill
                      @click="goBack"
            >
              <icon-base
                :title="$t('common.back')"
                class="icon-18"
                role="img"
                data-cy="backButton"
              >
                <icon-arrow-left/>
              </icon-base>
            </b-button>
          </slot>
        </div>

        <div v-if="$slots['center'] || headerTitle">
          <slot name="center">
            <h1>
              {{ headerTitle }}
            </h1>
          </slot>
        </div>

        <div class="right mr-2 mr-lg-1 d-flex" v-if="$slots['right']">
          <slot name="right"/>
        </div>
      </b-navbar>

      <div
        id="toggle-bar"
        class="py-0 px-2 px-lg-0 w-100 bg-light"
        v-if="$slots['toggle-bar']"
      >
        <transition name="toggle-bar-slide">
          <slot name="toggle-bar"/>
        </transition>
      </div>
    </div>

    <div id="info-bar" v-if="$slots['info-bar']">
      <slot name="info-bar"/>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    backTarget: {
      type: [String, Object],
      default: undefined
    },
    headerTitle: {
      type: String,
      default: ''
    },
    shadow: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    allRoutes() {
      return this.getAllChildRoutes(this.$router.options.routes)
    },
    parentRoute() {
      let parentRoute = this.allRoutes.find(({ name = '' }) => name === this.$route.meta.parent)
      if (!parentRoute) {
        parentRoute = this.allRoutes.find(({ name = '' }) => name === this.$route.params.listType)
      }
      return parentRoute
    },
    backLabel() {
      return this.parentRoute && this.parentRoute.meta && this.parentRoute.meta.title
        ? this.parentRoute.meta.title
        : this.$i18n.t('common.back')
    }
  },
  methods: {
    getAllChildRoutes(routes) {
      routes.forEach(route => {
        if (route.children) routes = routes.concat(this.getAllChildRoutes(route.children))
      })
      return routes
    },
    goBack() {
      return this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
header {
  z-index: 11;

  #header-wrapper {
    width: 100%;
    z-index: 12;
    position: relative;
  }

  #navbar {
    max-width: $breakpoint-lg;
    margin: auto;
    height: 56px;
    z-index: 13;
  }
  #toggle-bar {
    max-width: $breakpoint-lg;
    margin: auto;
    z-index: 12;
  }

  .navbar-brand {
    position: absolute;
    width: 100%;
    text-align: center;
  }
  .left {
    position: absolute;
    left: 0;
  }
  .right {
    position: absolute;
    right: 0;
  }
  .nav-item {
    min-width: 48px;
    min-height: 48px;
    display: inline-block;
  }

  .nav-link {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    min-height: 48px;
    padding: 0;
  }

  #info-bar {
    border-top: 1px solid #eee;
    z-index: 11;
  }

  .backButton {
    padding: 5px;
  }

  .backButton svg {
    width: 24px;
  }
}

.toggle-bar-slide-enter-active,
.toggle-bar-slide-leave-active {
transition: margin-top .3s ease-out;
}
.toggle-bar-slide-enter,
.toggle-bar-slide-leave-to {
margin-top: -56px;
}
.toggle-bar-slide-enter-to,
.toggle-bar-slide-leave {
margin-top: 0px;
}
</style>
