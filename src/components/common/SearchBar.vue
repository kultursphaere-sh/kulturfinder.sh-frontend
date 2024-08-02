<template>
  <div class="search-bar bg-light" data-cy="searchBarInput">
    <div class="search-input w-100 text-body">
      <b-nav-form @submit.prevent>
        <b-input-group
          :class="{
            inputFocused: searchInputIsFocused,
            inputNoResults: (institutions === null || institutions.length === 0 ) && searchInput !== '',
          }"
        >
          <b-input-group-prepend is-text>
            <icon-base
              title="Suche"
              class="icon-20"
              :class="inputSearchIconColor"
            >
              <icon-search/>
            </icon-base>
          </b-input-group-prepend>
          <b-form-input
            id="search-form"
            class="bg-light"
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
              class="border-0 text-body"
              @click="searchInput = ''"
              role="button"
            >
              <icon-base
                title="Zurücksetzen"
                class="icon-20"
              >
                <icon-reset-input/>
              </icon-base>
            </b-button>
            <b-button
              v-if="showToListButton"
              variant="themed"
              class="align-items-center flex-shrink-0"
              :to="`/${$route.params.locale}/institutions/list?searchQuery=${$store.state.filters.searchQuery}`"
              role="button"
            >
              <icon-base :title="$t('dashboard.toResultsPage')" class="icon-22">
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
import { mapGetters } from 'vuex'

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
    ...mapGetters({
      filteredInstitutions: 'institutions/getFiltered'
    }),
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
        ? 'text-reset'
        : (this.filteredInstitutions === null || this.filteredInstitutions.length === 0)
          ? 'text-danger'
          : 'text-icon-primary'
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
  border-radius: 0 5px 5px 0;
}

.form-inline {
  display: block;
}

.inputFocused {
  border-color: var(--body-color) !important;
}

.inputNoResults {
  border-color: var(--danger) !important;
}

.text-icon-primary {
  color: var(--primary);
}

.input-group {
  border: 1px solid var(--muted);
  border-radius: 5px;
}

.input-group-prepend {
  border-color: var(--muted);
}

.input-group-text {
  background-color: var(--light);
  padding-right: 0;
  border: 0;
}
#search-form {
  border: 0;
  box-shadow: none !important;
  letter-spacing: 0.001px;
  color: var(--body-color);
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
    border-right: 1px solid var(--muted);
  }
}

a.btn-themed:hover, a.btn-themed:active, a.btn-themed.active {
  background-color: var(--primary) !important;
  color: $white;
}

a.btn-themed:focus, a.btn-themed.focus {
  box-shadow: 0 0 0 .2rem var(--primary-shadow);
}
</style>
