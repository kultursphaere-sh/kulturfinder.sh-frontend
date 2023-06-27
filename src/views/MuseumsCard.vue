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
    <ks-header :header-title="$t('common.museums-card')"/>

    <div id="main-container">
      <div id="main-content" class="position-relative">
        <b-container class="p-4">
          <b-container class="text-center">
            <img id="museumscard"
                 src="@/assets/images/logos/museumscard_logo_2023_rotbeige.svg"
                 class="museumscard-logo"
                 alt="Museumscard"
            >
          </b-container>
        </b-container>
        <template>
          <b-container class="w-md-90 px-4 pb-2f">
            <b-container class="ks-card-container pb-2 mt-2 mb-5">
              <b-row class="justify-content-center">
                <!-- TODO Add Ticket Page and change route -->
                <ks-card
                  class="ks-card"
                  :route="`/${$route.params.locale}/institutions/map/museumscard/ticket`"
                  :text="$t('museumscard.tickets')"
                  :image-source="require(`@/assets/images/icons/cards/tickets.svg`)"
                  :ticket="true"
                />
                <ks-card
                  class="ks-card"
                  :href="'https://www.meine-museumscard.de'" target="_blank"
                  :image-source="require(`@/assets/images/logos/museumscardLogo-blau.png`)"
                  :museumscard="true"
                />
                <ks-card
                  class="ks-card"
                  :route="`/${$route.params.locale}/institutions/map?tags=MuseumsCard`"
                  :text="$t('common.map')"
                  :image-source="require(`@/assets/images/icons/cards/map.svg`)"
                />
                <ks-card
                  class="ks-card"
                  :route="`/${$route.params.locale}/institutions/list?tags=MuseumsCard`"
                  :text="$t('common.list')"
                  :image-source="require(`@/assets/images/icons/cards/list.svg`)"
                />
              </b-row>
            </b-container>
            <!-- Headline -->
            <div class="headline text-primary">
              <h2 class="mb-1 pb-3 pt-1">{{ $t('common.museums-card') }}</h2>
            </div>
            <p class="m-4">{{ $t('museumscard.description') }}</p>
            <p class="m-4">{{ $t('museumscard.info') }}</p>
            <p class="m-4">{{ $t('museumscard.description2') }}</p>
          </b-container>
          <hr class="mt-5 mb-3">
          <section
            id="footer"
            class="w-100 m-0 pb-4 text-center"
          >
            <!-- TODO: Fix backwards route from Impressum -->
            <router-link :to="`/${$route.params.locale}/about`" class="footer-text px-2 ">
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
