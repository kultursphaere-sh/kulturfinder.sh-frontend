<template>
  <b-dropdown
    id="colormode-dropdown"
    size="sm"
    class="d-flex"
    variant="transparent"
    right
    role="tablist"
  >
    <template #button-content>
      <icon-base
        :title="currentMode.name"
        role="img"
        class="flag icon-18"
      >
        <component :is="currentMode.icon"/>
      </icon-base>
    </template>
    <b-dropdown-item
      v-for="(mode, key) in modes"
      :key="key"
      :active="colormode === key"
      @click="changeMode(key)"
      role="tab"
    >
      <icon-base
        :title="mode.name"
        role="img"
        class="flag icon-18"
      >
        <component :is="mode.icon"/>
      </icon-base>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import i18n from '@/i18n'

export default {
  name: 'ColormodeChanger',
  data() {
    return {
      modes: {
        dark: {
          icon: 'IconMoon',
          name: i18n.t('colormodes.dark.name')
        },
        light: {
          icon: 'IconSun',
          name: i18n.t('colormodes.light.name')
        }
      }
    }
  },
  computed: {
    colormode() {
      return this.$store.state.darkmode ? 'dark' : 'light'
    },
    currentMode() {
      return this.modes[this.colormode]
    }
  },
  methods: {
    changeMode(mode) {
      if (this.colormode !== mode) {
        this.$store.dispatch('switchColormode')
      }
    }
  }
}
</script>
<style lang="scss">
#colormode-dropdown .dropdown-menu {
  min-width: 0;
  width: 52px;
  background-color: var(--light);
}

.dropdown-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  height: 30px;
  color: var(--body-color);
}

.dropdown-item.active, .dropdown-item:active,
.dropdown-item:hover, .dropdown-item:focus{
  background-color: var(--primary);
  color: $white;
}

.dropdown-toggle, .dropdown-toggle:hover { /* important for focus border fix */
  border: 0;
  color: var(--body-color);
}
.dropdown-toggle:focus {
  background: var(--primary);
  color: $white;
  box-shadow: none;
  border: 0;
}
</style>
