<template>
  <div id="museumscard">
    <vue-headful
      :title="$t('cityOfLiterature.shortTitle') + ' | ' + appName"
      :description="$t('cityOfLiterature.siteDescription')"
      :keywords="appKeywords"
      :lang="`/${$route.params.locale}/`"
      og-locale="de"
      :url="appURL"
    />
    <ks-header>
      <template #center>
        <b-nav-item router-link :to="`/${$route.params.locale}/`">
          <img
            height="40px"
            class="logo p-0 img-light"
            :src="'/' + tenant + '/img/logos/kf_logo_light.png'"
            :alt="$t('navbar.logo')"
            data-cy="kulturfinderLogo"
          >
          <img
            height="40px"
            class="logo p-0 img-dark"
            :src="'/' + tenant + '/img/logos/kf_logo_dark.png'"
            :alt="$t('navbar.logo')"
            data-cy="kulturfinderLogo"
          >
        </b-nav-item>
      </template>
    </ks-header>

    <div id="main-container">
      <div id="main-content" class="position-relative">
        <img
          :src="require(`@/assets/images/logos/cityOfLiterature_logo_english.jpg`)"
          class="cityOfLiterature-logo"
          alt="City of Literature"
          data-cy="cityOfLiteratureLogo"
        >
        <template>
          <b-container id="card-container" class="w-md-90 px-4 pb-2f">
            <b-container class="ks-card-container pb-2 mt-2 mb-5">
              <b-row class="justify-content-center">
                <ks-card
                  :href="'https://www.kultur.bremen.de/service/city-of-literature-23256'" target="_blank"
                  :image-source="require(`@/assets/images/logos/logo_bremen.svg`)"
                  data-cy="cityOfLiteratureCard"
                />
                <ks-card
                  :route="`/${$route.params.locale}/institutions/map?tags=CityOfLiterature`"
                  :text="$t('common.map')"
                  icon="IconMap"
                  data-cy="mapCard"
                />
                <ks-card
                  :route="`/${$route.params.locale}/institutions/list?tags=CityOfLiterature`"
                  :text="$t('common.list')"
                  icon="IconList"
                  data-cy="listCard"
                />
              </b-row>
            </b-container>
          </b-container>
        </template>
        <b-container class="w-md-90 px-4 pb-2f">
          <!-- Headline -->
          <div class="headline text-primary">
            <h2 class="mb-1 pb-3 pt-1" data-cy="cityOfLiteratureHeadline">{{ $t('cityOfLiterature.longTitle') }}</h2>
          </div>
          <p class="m-4" data-cy="museumsCardDescription1">{{ $t('cityOfLiterature.intro') }}</p>
          <p class="m-4" data-cy="museumsCardDescription1">{{ $t('cityOfLiterature.background') }}</p>
        </b-container>
        <hr class="mt-5 mb-3">
        <section
          id="footer"
          class="w-100 m-0 pb-4 text-center"
        >
          <router-link :to="`/${$route.params.locale}/about`" class="footer-text px-2 " data-cy="about">
            {{ $t("navbar.legalNotice") }}
          </router-link>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import KsHeader from '@/components/layout/Header.vue'
import ScrollPosition from '@/mixins/scrollposition'
import KsCard from '@/components/dashboard/Card.vue'
import i18n from '@/i18n'

export default {
  name: 'CityOfLiterature',
  components: {
    KsCard,
    KsHeader
  },
  mixins: [ScrollPosition],
  computed: {
    appURL: function () { return process.env.VUE_APP_URL },
    appName: function () { return process.env.VUE_APP_NAME },
    appKeywords: function () { return process.env.VUE_APP_KEYWORDS },
    tenant: function () { return process.env.VUE_APP_TENANT },
    locale: function () { return i18n.locale }
  }
}

</script>

<style lang="scss" scoped>
.text-padding{
  padding: 1.5em;
}
.cityOfLiterature-logo{
  width: 100%;
  padding: 8px 24px 8px 24px;
}

.ks-card-container {
  margin-top: 50px;
  margin-bottom: 50px;
}
.ks-card {
  border: 1px solid var(--primary);
  border-radius: 9px;
}
.footer-text{
  font-size: 0.8rem;
  color: var(--muted);
  margin-bottom: 5px;
}
</style>
