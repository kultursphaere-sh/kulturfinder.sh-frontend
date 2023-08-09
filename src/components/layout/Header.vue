<template>
  <header id="app-header" :class="{'shadow-sm': shadow}">
    <div id="header-wrapper">
      <b-navbar
        id="navbar"
        class="w-100 p-0 align-items-center justify-content-center"
        type="light"
      >
        <div class="left ml-2 ml-lg-1">
          <slot name="left">
            <b-button pill :to="backRoute">
              <icon-base
                :title="backLabel"
                color="#3c4d61"
                role="img"
                height="18"
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
        class="py-0 px-2 px-lg-0 w-100"
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
    backRoute() {
      const fallbackRoute = this.parentRoute
        ? { name: this.parentRoute.name, params: this.$route.params }
        : `/${this.$route.params.locale}`

      const backTargetWithCurrentParams = { params: this.$route.params, ...this.backTarget }

      return this.backTarget ? backTargetWithCurrentParams : fallbackRoute
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
    }
  }
}
</script>

<style scoped>
.btn {
  padding: 4px;
}
.btn:focus, .btn:hover {
  background-color: #fff !important;
  box-shadow: none;
  border: 1px solid #fff;
}
.btn:active {
  background-color: rgb(247, 247, 247) !important;
}
</style>

<style lang="scss">
header {
  z-index: 11;
  background-color: #fff !important;

  #header-wrapper {
    background-color: #fff;
    width: 100%;
    z-index: 12;
    position: relative;
  }

  #navbar {
    background-color: #fff;
    max-width: $breakpoint-lg;
    margin: auto;
    height: 56px;
    z-index: 13;
  }
  #toggle-bar {
    background-color: #fff;
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
