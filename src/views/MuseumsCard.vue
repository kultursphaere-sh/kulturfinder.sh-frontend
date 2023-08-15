<template>
  <div id="museumscard">
    <vue-headful
      :title="$t('common.museums-card') + ' | ' + $t('SEO.title')"
      :description="$t('common.museums-card')"
      :keywords="$t('SEO.commonKeywords')"
      :lang="`/${$route.params.locale}/`"
      og-locale="de"
      url="https://kulturfinder.sh"
    />
    <ks-header>
      <!-- Logo mit Link zur Homepage -->
      <template #center>
        <b-nav-item router-link :to="`/${$route.params.locale}/`">
          <img
            height="40px"
            class="logo p-0"
            src="@/assets/images/logos/kf_logo.png"
            :alt="$t('navbar.logo')"
            role="img"
            data-cy="kulturfinderLogo"
          >
        </b-nav-item>
      </template>
    </ks-header>

    <div id="main-container">
      <div id="main-content" class="position-relative">
        <b-container class="p-4">
          <b-container class="text-center">
            <img id="museumscard"
                 src="@/assets/images/logos/museumscard_logo_2023_rotbeige.svg"
                 class="museumscard-logo"
                 alt="Museumscard"
                 data-cy="museumsCardLogo"
            >
          </b-container>
        </b-container>
        <template>
          <b-container id="kachel-container" class="w-md-90 px-4 pb-2f">
            <b-container class="ks-card-container pb-2 mt-2 mb-5">
              <b-row class="justify-content-center">
                <ks-card
                  class="ks-card"
                  :href="'https://www.meine-museumscard.de'" target="_blank"
                  :text="$t('museumscard.tickets')"
                  :image-source="require(`@/assets/images/logos/museumscard_logo_blue.png`)"
                  :museumscard="true"
                  data-cy="museumsCardKachel"
                />
                <ks-card
                  class="ks-card"
                  :route="`/${$route.params.locale}/institutions/map?tags=MuseumsCard`"
                  :text="$t('common.map')"
                  :image-source="require(`@/assets/images/icons/cards/map.svg`)"
                  data-cy="mapCard"
                />
                <ks-card
                  class="ks-card"
                  :route="`/${$route.params.locale}/institutions/list?tags=MuseumsCard`"
                  :text="$t('common.list')"
                  :image-source="require(`@/assets/images/icons/cards/list.svg`)"
                  data-cy="listCard"
                />
              </b-row>
            </b-container>
          </b-container>
          <b-container class="w-md-90 px-4 pb-2f">
            <!-- Headline -->
            <div class="headline text-primary">
              <h2 class="mb-1 pb-3 pt-1" data-cy="museumsCardHeadline">{{ $t('common.museums-card') }}</h2>
            </div>
            <p class="m-4" data-cy="museumsCardDescription1">{{ $t('museumscard.description') }}</p>
            <p class="m-4" data-cy="museumsCardDescription2">{{ $t('museumscard.info') }}</p>
            <p class="m-4" data-cy="museumsCardNahverkehrDescription">{{ $t('museumscard.nahverkehr') }}</p>
            <p class="m-4" data-cy="museumsCardDescription3">{{ $t('museumscard.description2') }}</p>
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
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import KsHeader from '@/components/layout/Header.vue'
import ScrollPosition from '@/mixins/scrollposition'
import KsCard from '@/components/dashboard/Card.vue'

export default {
  name: 'MuseumsCard',
  components: {
    KsCard,
    KsHeader
  },
  mixins: [ScrollPosition]
}

</script>

<style lang="scss" scoped>
.text-padding{
  padding: 1.5em;
}
.museumscard-logo{
  height: 30%;
  width: 40%;
  padding-top: 36px;
  padding-bottom: 36px;
}

.ks-card-container {
  margin-top: 50px;
  margin-bottom: 50px;
}
.ks-card {
  border: 1px solid $primary;
  border-radius: 9px;
}
.footer-text{
  font-size: 0.8rem;
  color: #576165;
  margin-bottom: 5px;
}
</style>
