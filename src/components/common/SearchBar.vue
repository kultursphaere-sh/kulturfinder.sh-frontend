<template>
  <div class="search-bar" data-cy="searchBarInput">
    <div class="search-input w-100">
      <b-nav-form @submit.prevent>
        <b-input-group
          :class="{
            inputFocused: searchInputIsFocused,
            inputNoResults: (institutions === null || institutions.length === 0 ) && searchInput !== '',
          }"
        >
          <b-input-group-prepend is-text>
            <icon-base
              height="20"
              title="Suche"
              width="20"
              :color="inputSearchIconColor"
            >
              <icon-search/>
            </icon-base>
          </b-input-group-prepend>
          <b-form-input
            id="search-form"
            ref="searchbar"
            list="auto-complete"
            type="search"
            placeholder="Ort, Museum, ..."
            autocomplete="off"
            v-model="searchInput"
            :debounce="275"
            @focus="searchInputIsFocused = true"
            @blur="searchInputIsFocused = false"
            @keydown.native="inputKeydownHandler"
          />
          <b-input-group-append v-if="searchInput || showToListButton" class="ml-0">
            <b-button
              variant="outline-light"
              v-if="searchInput"
              id="search-reset-icon"
              class="border-0 text-muted"
              @click="searchInput = ''"
              role="button"
            >
              <icon-base
                title="Zurücksetzen"
                height="20"
                width="20"
              >
                <icon-reset-input/>
              </icon-base>
            </b-button>
            <b-button
              v-if="showToListButton"
              variant="outline-primary"
              class="align-items-center flex-shrink-0 border-0"
              :to="`/${$route.params.locale}/institutions/list?searchQuery=${$store.state.filters.searchQuery}`"
              role="button"
            >
              <icon-base
                :title="$t('dashboard.toResultsPage')"
                height="22"
                width="22"
              >
                <icon-arrow-right/>
              </icon-base>
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-nav-form>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'

const debounceTrackSiteSearch = debounce(fn => fn(), 1000)

export default {
  name: 'SearchBar',
  data() {
    return {
      searchInputIsFocused: false
    }
  },
  props: {
    institutions: {
      type: Array,
      default: () => []
    },
    showToListButton: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    searchInput: {
      get() {
        return this.$store.state.filters.searchQuery
      },
      set(value) {
        this.$store.dispatch('filters/updateSearchQuery', value)
        if (this.matomoActive) {
          debounceTrackSiteSearch(() => this.$matomo.trackSiteSearch(value))
        }
      }
    },
    inputSearchIconColor() {
      return this.searchInput === ''
        ? '#869094'
        : (this.institutions === null || this.institutions.length) === 0
          ? '#c01252'
          : '#003064'
    },
    matomoActive: function () { return process.env.VUE_APP_MATOMO === 'true' }
  },
  methods: {
    focusInput() {
      setTimeout(() => this.$refs.searchbar.focus(), 50)
    },
    blurInput() {
      this.$refs.searchbar.blur()
    },
    inputKeydownHandler(event) {
      const enterKey = 13
      if (event.which === enterKey) {
        this.$emit('enter', this.searchInput)
      }
    }
  }
}
</script>

<style scoped lang="scss">

/* clears the 'X' from Internet Explorer */
input[type=search]::-ms-clear {  display: none; width : 0; height: 0; }
input[type=search]::-ms-reveal {  display: none; width : 0; height: 0; }

/* clears the 'X' from Chrome */
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration { display: none; }

.search-bar {
  width: 100%;
  height: 56px;
  padding-top: 4px;
  background-color: #fff;
  border-radius: 0 5px 5px 0;
}

.form-inline {
  display: block;
}

.inputFocused {
  border-color: #000 !important;
}

.inputNoResults {
  border-color: #c01252 !important;
}

.input-group {
  border: 1px solid #ced4da;
  border-radius: 5px;
}

.input-group-prepend {
  border-color: #ced4da;
}

.input-group-text {
  background-color: #fff;
  padding-right: 0;
  border: 0;
}
#search-form {
  border: 0;
  box-shadow: none !important;
  letter-spacing: 0.001px;
}

.input-group-append .btn:not(:last-child) {
  margin-right: 6px;

  &::after {
    content: "";
    pointer-events: none;
    position: absolute;
    right: -3px;
    top: 6px;
    bottom: 6px;
    border-right: 1px solid #ced4da;
  }
}
</style>
