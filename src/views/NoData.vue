<template>
  <div id="about">
    <vue-headful
      :title="$t('navbar.noData') + ' | ' + appName"
      :description="appDescription"
      :keywords="appKeywords"
      :lang="`${locale}`"
      og-locale="de"
      :url="appURL"
    />
    <ks-header :header-title="$t('navbar.noData')">
      <template #left>
        <b-button
          id="reset-button"
          class="labeled-button"
          pill
          @click="onReload()"
        >
          <icon-base
            :title="$t('noData.reload')"
            color="#ad013d"
            width="18"
            height="18"
            class="m-auto"
          >
            <icon-reset-settings/>
          </icon-base>
          <label id="reset-label" class="labeled-button-label">{{ $t("noData.reload") }}</label>
        </b-button>
      </template>
    </ks-header>

    <div id="main-container" v-scroll-lock="true">
      <div id="main-content">
        <b-container class="p-4">
          <b-container class="about-logo">
            <img
              :alt="$t('navbar.logo')"
              id="logo"
              :src="'/' + tenant + '/img/logos/kf_logo.png'"
            >
          </b-container>
          <hr>
          <p class="mt-4">
            {{ $t("noData.welcome") }}
          </p>
          <p class="mt-4">
            {{ $t("noData.notDownloadable") }}
          </p>
          <h2 class="mt-4">{{ $t("common.contact") }}</h2>
          <p>
            <span class="contact">
              <icon-base
                color="#003064"
                title="Email-Adresse"
                class="mr-2"
                role="img"
              >
                <icon-mail/>
              </icon-base>
              <a :href="'mailto:' + $t('common.mailto')">
                {{ $t("common.mailto") }}
              </a>
            </span>
          </p>
          <b-row wrap class="w-100 m-0 pt-2 pb-2 justify-content-center">
            <b-btn
              variant="link"
              v-b-modal.sign-language-modal
              class="footer-text px-2 pt-0 pb-3 text-decoration-none"
            >
              <icon-base
                width="18"
                height="18"
                color="#576165"
              >
                <icon-sign-language/>
              </icon-base>
              {{ $t("dashboard.signLanguage") }}
            </b-btn>
            <sign-language-modal/>
            <router-link
              :to="`/${$route.params.locale}/no-data/about`"
              class="footer-text px-2 pt-0 pb-3"
            >
              <icon-base
                width="18"
                height="18"
                color="#576165"
              >
                <icon-privacy/>
              </icon-base>
              {{ $t("navbar.legalNotice") }}
            </router-link>
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import KsHeader from '@/components/layout/Header.vue'
import ScrollPosition from '@/mixins/scrollposition'
import SignLanguageModal from '../components/dashboard/SignLanguageModal.vue'
import i18n from '@/i18n'

export default {
  name: 'NoData',
  computed: {
    ...mapGetters({
      institutions: 'institutions/getAll',
      timeout: 'institutions/getTimeout'
    }),
    appURL: function () { return process.env.VUE_APP_URL },
    appName: function () { return process.env.VUE_APP_NAME },
    appDescription: function () { return process.env.VUE_APP_DESCRIPTION },
    appKeywords: function () { return process.env.VUE_APP_KEYWORDS },
    tenant: function () { return process.env.VUE_APP_TENANT },
    locale: function () { return i18n.locale }
  },
  mounted() {
    if (this.institutions.length > 0) {
      console.log('INSTITUTIONS AVAILABLE: ', this.institutions)
      this.$router.push(`/${this.$i18n.locale}`)
    }
  },
  methods: {
    onReload() {
      window.location.reload(true)
    }
  },
  components: {
    KsHeader,
    SignLanguageModal
  },
  mixins: [ScrollPosition]
}
</script>

<style scoped>

.about-logo {
  display: flex;
  justify-content: center;
  align-content: center;
}

#logo {
  max-height: 75px;
}

.contact {
  display: flex;
  align-items: center;
}
</style>
