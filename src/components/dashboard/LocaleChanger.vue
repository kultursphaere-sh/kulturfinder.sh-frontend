<template>
  <b-dropdown
    id="locales-dropdown"
    size="sm"
    class="d-flex"
    right
    role="tablist"
  >
    <template #button-content>
      <img
        height="22px"
        class="flag p-0"
        :src="currentLocale.icon"
        :alt="$t('navbar.logo')"
        role="img"
      >
    </template>
    <b-dropdown-item
      variant="light"
      v-for="(locale, key) in locales"
      :key="key"
      :active="getLocale() === key"
      @click="changeLocale(key)"
      role="tab"
    >
      <img
        height="22px"
        class="flag p-0"
        :src="locale.icon"
        :alt="locale.name"
        role="img"
      >
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import i18n from '@/i18n'
import localeIconDeutsch from '@/assets/images/icons/locales/deutsch.svg'
import localeIconEnglish from '@/assets/images/icons/locales/english.svg'
import localeIconDansk from '@/assets/images/icons/locales/dansk.svg'

export default {
  name: 'LocaleChanger',
  data() {
    return {
      locales: {
        ...(process.env.VUE_APP_LANGUAGES.includes('de') && {
          de: {
            icon: localeIconDeutsch,
            name: i18n.t('locales.de.name')
          }
        }),
        ...(process.env.VUE_APP_LANGUAGES.includes('en') && {
          en: {
            icon: localeIconEnglish,
            name: i18n.t('locales.en.name')
          }
        }),
        ...(process.env.VUE_APP_LANGUAGES.includes('da') && {
          da: {
            icon: localeIconDansk,
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
