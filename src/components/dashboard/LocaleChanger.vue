<template>
  <b-dropdown
    id="locales-dropdown"
    size="sm"
    class="d-flex"
    right
    role="tablist"
  >
    <template #button-content>
      <icon-base
        :title="currentLocale.name"
        role="img"
        class="flag icon-22"
      >
        <component :is="currentLocale.icon"/>
      </icon-base>
    </template>
    <b-dropdown-item
      variant="light"
      v-for="(locale, key) in locales"
      :key="key"
      :active="getLocale() === key"
      @click="changeLocale(key)"
      role="tab"
    >
      <icon-base
        :title="locale.name"
        role="img"
        class="flag icon-22"
      >
        <component :is="locale.icon"/>
      </icon-base>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import i18n from '@/i18n'

export default {
  name: 'LocaleChanger',
  data() {
    return {
      locales: {
        ...(process.env.VUE_APP_LANGUAGES.includes('de') && {
          de: {
            icon: 'IconDeutsch',
            name: i18n.t('locales.de.name')
          }
        }),
        ...(process.env.VUE_APP_LANGUAGES.includes('en') && {
          en: {
            icon: 'IconEnglish',
            name: i18n.t('locales.en.name')
          }
        }),
        ...(process.env.VUE_APP_LANGUAGES.includes('da') && {
          da: {
            icon: 'IconDansk',
            name: i18n.t('locales.da.name')
          }
        })
      }
    }
  },
  computed: {
    currentLocale() {
      return this.locales[this.getLocale()]
    },
    matomoActive: function () { return process.env.VUE_APP_MATOMO === 'true' }
  },
  methods: {
    changeLocale(locale) {
      if (this.matomoActive) {
        this.$matomo.trackEvent(['locale', 'set locale', 'locale', locale])
      }
      this.$router.push(`/${locale}`)
    },
    getLocale() {
      return this.$i18n.locale
    }
  }
}
</script>
<style lang="scss">
#locales-dropdown .dropdown-menu {
  min-width: 0;
  width: 52px;
}
.dropdown-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  height: 30px;
}
.dropdown-item.active {
  background: $gray-dark;
}
.dropdown-item:active {
  background: $gray-dark;
}
.dropdown-toggle { /* important for focus border fix */
  border: 0;
}
.dropdown-toggle:focus {
  background: #fff;
  box-shadow: none;
  border: 0;
}
</style>
