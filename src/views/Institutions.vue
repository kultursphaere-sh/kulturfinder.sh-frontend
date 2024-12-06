<template>
  <div id="institutions">
    <vue-headful
      :title="titleString"
      :description="appDescription"
      :keywords="appKeywords"
      :lang="`${locale}`"
      og-locale="de"
      :url="appURL"
    />
    <ks-header
      :back-target="{
        name: 'dashboard',
        query: { tags: '' }
      }"
      :toggle-bar-open="searchbarOpen"
    >
      <!-- Tab containers to toggle between Map and List -->
      <template #center>
        <div class="tab-container d-flex justify-content-center align-items-center align-self-center">
          <b-button
            class="tab tab-left p-2"
            :class="{ activeTab: listType === 'map' }"
            :to="`/${$route.params.locale}/institutions/map`"
          >
            <h6>{{ $t("common.map") }}</h6>
          </b-button>
          <b-button
            class="tab tab-right p-2"
            :class="{ activeTab: listType === 'list' }"
            :to="`/${$route.params.locale}/institutions/list`"
          >
            <h6>{{ $t("common.list") }}</h6>
          </b-button>
        </div>
      </template>
      <template #right>
        <!-- Searchbar Button-->
        <b-button
          pill
          variant="themed"
          class="align-items-center border-0"
          @click="onToggleSearchbar"
          role="button"
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
        <!-- Home Button -->
        <b-nav-item router-link :to="`/${locale}`" link-classes="btn btn-themed rounded-pill">
          <icon-base
            title="Home-Button"
          >
            <icon-home/>
          </icon-base>
        </b-nav-item>
      </template>
      <template #toggle-bar>
        <div
          id="search-collapse"
          class="w-100"
          v-show="searchbarOpen"
        >
          <search-bar
            ref="searchbar"
            :institutions="institutions"
            :searchbar-open="searchbarOpen"
          />
        </div>
      </template>

      <template #info-bar v-if="!userPosition">
        <transition name="no-gps-bar-slide">
          <no-gps-bar
            v-if="!userPosition && !gpsBarClosed"
            @close="onCloseGpsBar"
          />
        </transition>
      </template>
    </ks-header>

    <div id="main-container" v-scroll-lock="true">
      <div
        id="no-results-container"
        class="p-3 text-center"
        v-if="institutions.length === 0"
        data-cy="noResultsContainer"
      >
        <span v-if="isFavorite">{{ $t("favorites.noFavorites") }}</span>
        <span v-else>{{ $t("navbar.noResults") }}</span>
      </div>

      <keep-alive>
        <router-view
          id="main-content"
          :class="{'full-width': listType === 'map'}"
          :institutions="institutions"
        />
      </keep-alive>

      <!-- Filter Button -->
      <b-button
        v-if="!isFavorite"
        id="filter-btn"
        variant="none"
        data-cy="filterButton"
        :class="[isFilterActive
          ? 'filter-btn-active'
          : 'filter-btn-passive']"
        class="position-fixed fixed-bottom mx-auto mb-4"
        :to="`/${$route.params.locale}/institutions/${listType}/filters`"
      >
        <icon-base
          :title="$t('common.filters')"
          class="mr-2"
        >
          <icon-controls/>
        </icon-base>
        {{ $t('filter.fabButtonLabel', { count: filters.length }) }}
      </b-button>
    </div>
  </div>
</template>

<script>
import SearchBar from '@/components/common/SearchBar.vue'
import KsHeader from '@/components/layout/Header.vue'
import NoGpsBar from '@/components/institutions/NoGpsBar.vue'
import { mapGetters } from 'vuex'
import i18n from '@/i18n'

export default {
  name: 'Institutions',
  data() {
    return {
      searchbarOpen: !!this.$store.state.filters.searchQuery,
      gpsBarClosed: false
    }
  },
  props: {
    listType: {
      type: String,
      default: 'list'
    }
  },
  computed: {
    ...mapGetters({
      institutions: 'institutions/getFiltered',
      userPosition: 'userPosition/getPosition',
      filters: 'filters/getAllFilters'
    }),
    isFavorite() {
      return this.$store.state.filters.isFavorite
    },
    isFilterActive() {
      return this.filters.length > 0
    },
    titleString() {
      if (this.$store.state.filters.isFavorite) {
        return this.$t('common.favorites') + ' | ' + process.env.VUE_APP_NAME
      } else {
        if (this.listType === 'list') {
          return this.$t('common.list') + ' | ' + process.env.VUE_APP_NAME
        } else {
          if (this.listType === 'map') {
            return this.$t('common.map') + ' | ' + process.env.VUE_APP_NAME
          }
        }
      }
      return this.$t('common.loading') + ' | ' + process.env.VUE_APP_NAME
    },
    appURL: function () { return process.env.VUE_APP_URL },
    appDescription: function () { return process.env.VUE_APP_DESCRIPTION },
    appKeywords: function () { return process.env.VUE_APP_KEYWORDS },
    locale: function () { return i18n.locale }
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
    onCloseGpsBar() {
      this.gpsBarClosed = true
    }
  },
  activated() {
    this.searchbarOpen = !!this.$store.state.filters.searchQuery

    if (this.$store.state.filters.searchQuery === ' ') {
      this.$store.dispatch('filters/updateSearchQuery', '')
      this.$refs.searchbar.focusInput()
    }
  },
  components: {
    KsHeader,
    SearchBar,
    NoGpsBar
  }
}
</script>

<style lang="scss" scoped>
header .btn {
  padding: 4px;
}
.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25vw;
  max-width: 200px;
  border: solid 1px var(--muted);
  border-radius: 0;
  color: var(--primary) !important;
  background-color: var(--light);
  font-weight: 500;
  cursor: pointer;
}
.tab-left {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.tab-right {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.activeTab, a.activeTab:visited {
  border: 1px solid var(--primary);
  background-color: var(--primary);
  color: $white !important;
}
a.activeTab:hover {
  background-color: var(--primary-light) !important;
  color: $white !important;
}
#filter-btn {
  width: 140px;
  height: 40px;
  box-shadow: rgba(0, 0, 0, 0.4) 0 1px 5px;
  border: 1px solid var(--primary);
  background-color: var(--light);
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter-btn-active {
  background-color: var(--primary) !important;
  color: white;
}
.filter-btn-passive {
  color: var(--primary);
  backround-color: var(--light) !important;
}
.filter-btn-active:active{
  background-color: var(--primary-light) !important;
}
.filter-btn-active:hover,.filter-btn-active:focus {
  background-color: var(--primary-light) !important;
}
.filter-btn-passive:active {
  background-color: var(--body-bg) !important;
}
.filter-btn-passive:hover, .filter-btn-passive:focus {
  background-color: var(--body-bg) !important;
}
.tab:focus:not(.activeTab) {
  background-color: var(--light) !important;
  box-shadow: none;
}
.tab:focus.activeTab, .tab:focus:active {
  box-shadow: 0 0 0 0.2rem var(--primary-shadow);
}
.tab:focus:not(.activeTab, :active) {
  box-shadow: none;
}
.tab:hover:not(.activeTab) {
  background-color: var(--body-bg) !important;
}
.tab:active:not(.activeTab) {
  background-color: var(--body-bg) !important;
}

.no-gps-bar-slide-enter-active,
.no-gps-bar-slide-leave-active {
transition: margin-top .3s ease-out;
}
.no-gps-bar-slide-enter,
.no-gps-bar-slide-leave-to {
margin-top: -40px;
}
.no-gps-bar-slide-enter-to,
.no-gps-bar-slide-leave {
margin-top: 0;
}
</style>
