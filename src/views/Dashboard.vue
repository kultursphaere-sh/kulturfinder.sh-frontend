<template>
  <div id="dashboard">
    <vue-headful
      :title="$t('SEO.dashboardTitle')"
      :description="$t('SEO.description')"
      :keywords="$t('SEO.commonKeywords')"
      :lang="`/${$route.params.locale}/`"
      og-locale="de"
      url="https://kulturfinder.sh"
    />
    <ks-header :shadow="false" :toggle-bar-open="searchbarOpen">
      <template #left>
        <locale-changer/>
      </template>
      <template #center>
        <b-nav-item router-link :to="`/${$route.params.locale}/`">
          <img
            height="54px"
            class="logo p-0"
            src="@/assets/images/logos/kf_logo.png"
            :alt="$t('navbar.logo')"
            role="img"
          >
        </b-nav-item>
      </template>
      <template #right>
        <b-button
          pill
          class="align-items-center border-0 p-2 mr-1"
          @click="onToggleSearchbar"
          role="button"
        >
          <icon-base
            :title="searchbarOpen ? $t('common.close') : $t('navbar.search')"
            color="#3c4d61"
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
          />
          <div
            id="search-preview"
            class="position-absolute flex-column justify-content-center bg-white rounded-bottom"
            :class="{
              'has-results': $store.state.filters.searchQuery && filteredInstitutions.length,
              'show-more-results-button': $store.state.filters.searchQuery && filteredInstitutions.length > first5FilteredInstitutions.length
            }"
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
              :image-source="require(`@/assets/images/icons/cards/map.svg`)"
            />
            <ks-card
              :route="`/${$route.params.locale}/institutions/list?isFavorite=false`"
              :text="$t('common.list')"
              :image-source="require(`@/assets/images/icons/cards/list.svg`)"
            />
          </b-row>
          <b-row class="justify-content-center">
            <ks-card
              :route="`/${$route.params.locale}/institutions/list?isFavorite=true`"
              :text="$t('common.favorites')"
              :image-source="require(`@/assets/images/icons/cards/favorites.svg`)"
              :small="true"
            />
            <ks-card
              :route="`/${$route.params.locale}/institutions/map/filters`"
              :text="$t('common.filters')"
              :image-source="require(`@/assets/images/icons/cards/filter.svg`)"
              :small="true"
            />
          </b-row>
          <b-row class="justify-content-center">
            <ks-card
              :route="`/${$route.params.locale}/institutions/list?tags=Living%20Image`"
              :text="$t('dashboard.living-images')"
              :image-source="require(`@/assets/images/icons/cards/livingImages.svg`)"
              :small="true"
            />
            <ks-card
              v-if="museumsCardEnabled"
              :route="`/${$route.params.locale}/institutions/map/museumscard`"
              :image-source="require(`@/assets/images/logos/museumscardLogo-blau.png`)"
              :small="true"
              :museumscard-small="true"
            />
            <ks-card
              v-else
              :route="`/${$route.params.locale}/institutions/list?tags=Videoclips`"
              :text="$t('dashboard.videoclips')"
              :image-source="require(`@/assets/images/icons/cards/videos.svg`)"
              :small="true"
            />
            <!-- SCHIETWETTER DASHBOARD-BUTTON
                <ks-card
              :route="`/${$route.params.locale}/institutions/map?tags=Schietwetter`"
              :text="$t('dashboard.schietwetter')"
              :image-source="require(`@/assets/images/icons/cards/indoor.svg`)"
              :small="true"
            /> -->
          </b-row>
        </b-container>

        <b-row wrap class="w-100 m-0 pt-2 pb-2 justify-content-center">
          <b-btn
            variant="link"
            v-b-modal.pwa-modal
            class="footer-text px-2 pt-0 pb-3 text-decoration-none"
            v-if="showDownloadLink"
          >
            <icon-base
              width="18"
              height="18"
              color="#576165"
            >
              <icon-download/>
            </icon-base>
            {{ $t("common.downloadApp") }}
          </b-btn>
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
            :to="`/${$route.params.locale}/about`"
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
import SignLanguageModal from '../components/dashboard/SignLanguageModal.vue'
import ScrollPosition from '@/mixins/scrollposition'
import detectRTC from 'detectrtc'

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
      ],
      museumsCardEnabled: process.env.VUE_APP_MUSEUMSCARD === 'true'
    }
  },
  components: {
    LocaleChanger,
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
    }
  },
  methods: {
    onToggleSearchbar() {
      if (this.searchbarOpen) {
        this.$refs.searchbar.blurInput()
        this.searchbarOpen = !this.searchbarOpen
        this.$store.dispatch('filters/updateSearchQuery', '')
      } else {
        this.searchbarOpen = !this.searchbarOpen
        this.$refs.searchbar.focusInput()
      }
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
  background-color: $gray;
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
  box-shadow: 0px 11px 10px #00000066;
  left: 0;
  right: 0;
  padding: 4px;
  top: 46px;

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
.ks-card-container {
  background-color: $gray;
}
.b-dropdown {
  background-color: var(--white) !important;
  > .dropdown-menu {
    min-width: 0;
    padding: 0;
    margin: 0;
    transform: translate3d(-20px, 40px, 0px);
  }
}
#dropdown-1__BV_toggle_{
  display: flex !important;
  // flex-direction: row !important;
  align-items: center !important;
}
.footer-text{
  font-size: 0.7rem;
  color: #576165;
}
.logo {
  width: auto;
  height: 40px;
}
.flag {
  width: auto;
  height: 30px;
}
</style>
