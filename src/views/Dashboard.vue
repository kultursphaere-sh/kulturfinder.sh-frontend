<template>
  <div id="dashboard">
    <vue-headful
      :title="appName"
      :description="appDescription"
      :keywords="appKeywords"
      :lang="`/${$route.params.locale}/`"
      og-locale="de"
      :url="appURL"
    />
    <ks-header :shadow="false" :toggle-bar-open="searchbarOpen">
      <template #left>
        <locale-changer data-cy="localeChanger"/>
        <colormode-changer data-cy="colormodeChanger"/>
      </template>
      <!-- Kulturfinder Logo -->
      <template #center>
        <b-nav-item router-link :to="`/${$route.params.locale}/`">
          <img
            height="56px"
            class="logo p-0 img-light"
            :src="'/' + tenant + '/img/logos/kf_logo_light.png'"
            :alt="$t('navbar.logo')"
            role="img"
            data-cy="mainLogo"
          >
          <img
            height="56px"
            class="logo p-0 img-dark"
            :src="'/' + tenant + '/img/logos/kf_logo_dark.png'"
            :alt="$t('navbar.logo')"
            role="img"
            data-cy="mainLogo"
          >
        </b-nav-item>
      </template>
      <template #right>
        <b-button
          variant="themed"
          pill
          class="align-items-center border-0 p-2 mr-1"
          @click="onToggleSearchbar"
          role="button"
          data-cy="searchBarButton"
        >
          <icon-base
            :title="searchbarOpen ? $t('common.close') : $t('navbar.search')"
            :alt="$t('navbar.search')"
            role="img"
          >
            <icon-close v-if="searchbarOpen" :alt="$t('navbar.search')"/>
            <icon-search v-else :alt="$t('navbar.search')"/>
          </icon-base>
        </b-button>
      </template>
      <template #toggle-bar>
        <div
          id="search-collapse"
          ref="search-collapse"
          class="w-100 position-relative"
          v-show="searchbarOpen"
        >
          <search-bar
            ref="searchbar"
            :institutions="institutions"
            :searchbar-open="searchbarOpen"
            :show-to-list-button="true"
            @enter="searchBarEnterHandler"
            data-cy="searchBarInput"
          />
          <div
            id="search-preview"
            class="position-absolute flex-column justify-content-center rounded-bottom"
            :class="{
              'has-results': $store.state.filters.searchQuery && filteredInstitutions.length,
              'show-more-results-button': $store.state.filters.searchQuery && filteredInstitutions.length > first5FilteredInstitutions.length
            }"
            data-cy="searchPreview"
          >
            <ks-list :change-title="false" :institutions="first5FilteredInstitutions"
                     list-type="institutions/dashboard"
            />
            <b-button
              variant="outline-primary"
              class="more-results-button align-self-center align-items-center"
              :to="`/${$route.params.locale}/institutions/list?searchQuery=${$store.state.filters.searchQuery}`"
              role="button"
            >
              {{ $t('dashboard.showAllResults') }}
            </b-button>
          </div>
        </div>
      </template>
    </ks-header>
    <div id="main-container" v-scroll-lock="true">
      <div id="main-content">
        <ks-carousel
          :institutions="institutions"
        />
        <b-container class="ks-card-container pt-3 pb-2">
          <b-row class="justify-content-center">
            <ks-card
              :route="`/${$route.params.locale}/institutions/map?isFavorite=false`"
              :text="$t('common.map')"
              icon="IconMap"
              data-cy="mapCard"
            />
            <ks-card
              :route="`/${$route.params.locale}/institutions/list?isFavorite=false`"
              :text="$t('common.list')"
              icon="IconList"
              data-cy="listCard"
            />
          </b-row>
          <b-row class="justify-content-center">
            <ks-card
              :route="`/${$route.params.locale}/institutions/list?isFavorite=true`"
              :text="$t('common.favorites')"
              icon="IconFavorites"
              :small="(tenant === 'sh')"
              data-cy="favoritesCard"
            />
            <ks-card
              :route="`/${$route.params.locale}/institutions/map/filters`"
              :text="$t('common.filters')"
              icon="IconFilter"
              :small="(tenant === 'sh')"
              data-cy="filtersCard"
            />
          </b-row>
          <b-row class="justify-content-center">
            <ks-card
              v-if="tenant === 'sh'"
              :route="`/${$route.params.locale}/institutions/list?tags=Living%20Image`"
              :text="$t('dashboard.living-images')"
              icon="IconLivingImages"
              :small="(tenant === 'sh')"
              data-cy="livingImagesCard"
            />
            <ks-card
              v-if="tenant === 'hb'"
              :route="`/${$route.params.locale}/institutions/map?tags=Schietwetter`"
              :text="$t('dashboard.schietwetter')"
              icon="IconIndoor"
              :small="(tenant === 'sh')"
              data-cy="indoorCard"
            />
            <ks-card
              v-if="museumsCardEnabled && tenant === 'sh'"
              :route="`/${$route.params.locale}/museumscard`"
              :image-source="require(`@/assets/images/logos/museumsCard2024greenBackground.png`)"
              :small="(tenant === 'sh')"
              :museumscard-small="true"
              data-cy="museumsCardKachel"
            />
            <ks-card
              v-if="cityOfLiteratureEnabled && tenant === 'hb'"
              :route="`/${$route.params.locale}/cityOfLiterature`"
              :image-source="require(`@/assets/images/logos/logo_cityOfLiterature.png`)"
              :text="$t('cityOfLiterature.shortTitle')"
              :small="false"
              data-cy="cityOfLiteratureCard"
            />
            <ks-card
              v-if="!museumsCardEnabled && !cityOfLiteratureEnabled"
              :route="`/${$route.params.locale}/institutions/list?tags=Videoclips`"
              :text="$t('dashboard.videoclips')"
              icon="IconVideos"
              :small="(tenant === 'sh')"
              data-cy="videoClipsCard"
            />
          </b-row>
        </b-container>

        <b-row wrap class="w-100 m-0 pt-2 pb-2 justify-content-center">
          <b-btn
            variant="link"
            v-b-modal.pwa-modal
            class="footer-text px-2 pt-0 pb-3 text-decoration-none"
            v-if="showDownloadLink"
          >
            <icon-base class="icon-20">
              <icon-download/>
            </icon-base>
            {{ $t("common.downloadApp") }}
          </b-btn>
          <b-btn
            variant="link"
            v-b-modal.sign-language-modal
            class="footer-text px-2 pt-0 pb-3 text-decoration-none"
            data-cy="signLanguage"
          >
            <icon-base class="icon-18">
              <icon-sign-language/>
            </icon-base>
            {{ $t("dashboard.signLanguage") }}
          </b-btn>
          <sign-language-modal/>
          <router-link
            :to="`/${$route.params.locale}/about`"
            class="footer-text px-2 pt-0 pb-3"
            data-cy="impressum"
          >
            <icon-base class="icon-18">
              <icon-privacy/>
            </icon-base>
            {{ $t("navbar.legalNotice") }}
          </router-link>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import KsList from '@/components/institutions/List.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import KsCarousel from '@/components/dashboard/Carousel.vue'
import KsCard from '@/components/dashboard/Card.vue'
import KsHeader from '@/components/layout/Header'
import { mapGetters } from 'vuex'
import LocaleChanger from '../components/dashboard/LocaleChanger'
import ColormodeChanger from '../components/dashboard/ColormodeChanger'
import SignLanguageModal from '../components/dashboard/SignLanguageModal.vue'
import ScrollPosition from '@/mixins/scrollposition'
import detectRTC from 'detectrtc'
import i18n from '@/i18n'

export default {
  name: 'Dashboard',
  data() {
    return {
      searchbarOpen: !!this.$store.state.filters.searchQuery,
      downloadSupportedOS: [
        'Windows',
        'Mac',
        'Android',
        'iOS'
      ]
    }
  },
  components: {
    LocaleChanger,
    ColormodeChanger,
    KsCarousel,
    KsCard,
    KsHeader,
    SearchBar,
    KsList,
    SignLanguageModal
  },
  mixins: [ScrollPosition],
  computed: {
    ...mapGetters({
      institutions: 'institutions/getAll',
      filteredInstitutions: 'institutions/getFiltered'
    }),
    first5FilteredInstitutions() {
      return this.$store.state.filters.searchQuery ? this.filteredInstitutions.slice(0, 5) : []
    },
    showDownloadLink() {
      return this.downloadSupportedOS.includes(detectRTC.osName) &&
        !window.matchMedia('(display-mode: standalone)').matches
    },
    focus() {
      console.log(this.searchbarOpen, this.$refs.searchCollapse.contains(document.activeElement))
      return this.$refs.searchCollapse.contains(document.activeElement)
    },
    museumsCardEnabled: function () { return process.env.VUE_APP_MUSEUMSCARD === 'true' },
    cityOfLiteratureEnabled: function () { return process.env.VUE_APP_CITY_OF_LITERATURE === 'true' },
    appURL: function () { return process.env.VUE_APP_URL },
    appName: function () { return process.env.VUE_APP_NAME },
    appDescription: function () { return process.env.VUE_APP_DESCRIPTION },
    appKeywords: function () { return process.env.VUE_APP_KEYWORDS },
    tenant: function () { return process.env.VUE_APP_TENANT },
    locale: function () { return i18n.locale }
  },
  methods: {
    onToggleSearchbar() {
      this.searchbarOpen = !this.searchbarOpen
      this.$nextTick(() => {
        if (this.searchbarOpen) {
          this.$refs.searchbar.$el.querySelector('input').focus()
        } else {
          this.$refs.searchbar.blurInput()
          this.$store.dispatch('filters/updateSearchQuery', '')
        }
      })
    },
    searchBarEnterHandler(value) {
      this.$router.push(`/${this.$route.params.locale}/institutions/list?searchQuery=${value}`)
    }
  },
  activated() {
    this.searchbarOpen = !!this.$store.state.filters.searchQuery

    if (this.$store.state.filters.searchQuery === ' ') {
      this.$store.dispatch('filters/updateSearchQuery', '')
      this.$refs.searchbar.focusInput()
    }
  }
}
</script>
<style lang="scss" scoped>
#main-content {
  background-color: var(--body-bg);
}

.ks-card-container {
  background-color: var(--body-bg);
}

#search-collapse {
  &:focus,
  &:focus-within {
    #search-preview.has-results {
      display: block;
    }
  }
  #search-preview.has-results:hover {
    display: block;
  }
}

#search-preview {
  display: none;
  box-shadow: 0 11px 10px #00000066;
  left: 0;
  right: 0;
  padding: 4px;
  top: 46px;
  background-color: var(--light);

  > .list {
    max-height: calc(100vh - 200px);
    overflow: auto;
  }

  .more-results-button {
    display: none;
    margin: 16px 0 12px 0;
  }

  &.show-more-results-button {
    .more-results-button {
      display: block;
    }
  }
}

.b-dropdown {
  background-color: var(--light) !important;
  > .dropdown-menu {
    min-width: 0;
    padding: 0;
    margin: 0;
    transform: translate3d(-20px, 40px, 0px);
  }
}

#dropdown-1__BV_toggle_{
  display: flex !important;
  align-items: center !important;
}

.footer-text{
  font-size: 0.7rem;
  color: var(--muted);
}

.logo {
  width: auto;
  height: 40px;
}

.flag {
  width: auto;
  height: 30px;
}

.btn-outline-primary {
  color: var(--primary);
  border-color: var(--primary);
}

.btn-outline-primary:hover, .btn-outline-primary:active {
  color: $white;
  border-color: var(--primary);
  background-color: var(--primary);
}

.btn-outline-primary:focus {
  box-shadow: 0 0 0 0.2rem var(--primary-shadow);
}

</style>
