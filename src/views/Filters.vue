<template>
  <div id="filters">
    <vue-headful
      :title="$t('common.filters') + ' | ' + $t('SEO.title')"
      :description="$t('SEO.description')"
      :keywords="$t('SEO.commonKeywords')"
      :lang="`/${$route.params.locale}/`"
      og-locale="de"
      url="https://kulturfinder.sh"
    />
    <ks-header :header-title="$t('common.filters')">
      <template #right>
        <b-button
          id="reset-button"
          class="labeled-button"
          pill
          :to="`/${$route.params.locale}/institutions/${listType}/filters?tags=`"
        >
          <icon-base
            :title="$t('filter.resetButtonLabel')"
            color="#ad013d"
            width="18"
            height="18"
            class="m-auto"
          >
            <icon-reset-settings/>
          </icon-base>
          <label id="reset-label" class="labeled-button-label">{{ $t("filter.resetButtonLabel") }}</label>
        </b-button>
      </template>
    </ks-header>

    <div id="main-container" v-scroll-lock="true">
      <div id="main-content">
        <b-container class="px-4 px-md-5">
          <p id="results" class="text-center py-4 m-0">
            {{ $t('filter.resultCount', { count: resultCount }) }}
          </p>
          <div class="control-group">
            <b-form-checkbox
              aria-describedby="filter-categories"
              aria-controls="filter-categories"
              v-model="isToggleAllCategories"
              @change="toggleAll"
            >
              <legend id="categories-label">
                <h2 class="mr-1 ml-md-3 text-dark">
                  {{ $t('common.categories') }}
                  <span>{{ $t('filter.all') }}</span>
                </h2>
              </legend>
            </b-form-checkbox>
            <hr>
            <b-form-group id="categories-group" aria-labeledby="categories-label">
              <b-form-checkbox-group
                id="filter-categories"
                v-model="activeCategories"
                :options="categories"
                name="categories"
                class="control-group"
                stacked
              />
            </b-form-group>
          </div>
          <hr class="mt-5">
          <hr class="mb-5">
          <legend id="tags-label">
            <h2 class="mt-4 mb-3 mx-md-3 text-dark">{{ $t('common.tags') }}</h2>
          </legend>
          <div class="mx-md-3">
            <b-form-group id="tags-group" aria-labeledby="tags-label">
              <b-form-checkbox-group
                v-model="activeTags"
                :options="tags"
                name="tags"
                class="checkbox-pill text-primary"
                stacked
              />
            </b-form-group>
          </div>
          <div class="row justify-content-center pt-4 pb-5">
            <b-button
              variant="primary"
              id="results-button"
              size="lg"
              :to="{ name: listType, query: filter, params: { listType, locale: $route.params.locale } }"
              :disabled="!resultCount"
            >
              {{ resultCount
                ? $t('filter.showResultsButtonLabelCount', { count: resultCount })
                : $t('filter.showResultsButtonLabelNoResults')
              }}
            </b-button>
          </div>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import KsHeader from '@/components/layout/Header.vue'

export default {
  name: 'Filters',
  props: {
    listType: {
      type: String,
      default: 'list'
    }
  },
  components: {
    KsHeader
  },
  computed: {
    ...mapGetters({
      tags: 'institutions/getAllTags',
      categories: 'institutions/getCategories',
      resultCount: 'institutions/getFilteredCount',
      filter: 'filters/getFilterQuery'
    }),
    isToggleAllCategories: {
      get() {
        return this.activeCategories.length === 0
      },
      set(value) {}
    },
    activeCategories: {
      get() {
        return this.$store.state.filters.categories
      },
      set(value) {
        this.$store.dispatch('filters/updateCategories', value)
      }
    },
    activeTags: {
      get() {
        return this.$store.state.filters.tags
      },
      set(value) {
        this.$store.dispatch('filters/updateTags', value)
      }
    }
  },
  methods: {
    toggleAll(checked) {
      this.activeCategories = !checked ? this.categories.slice() : []
    },
    onResetFilters() {
      this.$store.dispatch('filters/resetFilters').then(
        () => this.$router.push({ name: this.listType })
      )
    }
  }
}
</script>

<style lang="scss">
.control-group .custom-control.custom-checkbox {
  padding-left: 0;
  padding-right: 1.5rem
}
.control-group .custom-control-label {
    width: 100%;
    color: $primary
}
#filter-categories .custom-control {
  background-color: #fff;
  border-radius: 7px;
}
#filter-categories .custom-control:nth-child(odd) {
  background-color: $gray;
}
#filter-categories {
  .custom-control-label {
    padding: 0.5rem 0rem 0.5rem 1rem;
  }
}
.control-group .custom-control-label::before,
.control-group .custom-control-label::after {
  left: unset;
  top: 0;
  bottom: 0;
  margin: auto;
  right: -0.5rem;
  cursor: pointer;
  width: 20px;
  height: 20px;
}
.checkbox-pill {
  margin: -4px;
}
.checkbox-pill .custom-control.custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin: 4px 4px;
  padding: 0;
}
.checkbox-pill .custom-control.custom-checkbox .custom-control-label {
  display: inline-flex;
  align-items: center;
  border-radius: 50rem;
  cursor: pointer;
  height: 32px;
  padding: 18px;
  border: 1px solid $primary;
  user-select: none;
}
.checkbox-pill .custom-control-input:checked ~ .custom-control-label {
  background-color: var(--primary);
  border: 1px solid var(--primary);
  color: white
}
.checkbox-pill .custom-control-label::before,
.checkbox-pill .custom-control-label::after {
  content: unset;
}
.custom-control-label{
  display: flex;
}
</style>

<style lang="scss" scoped>
h2 span {
  font-weight: 300;
  font-size: 1.1rem;
}
#reset-button {
  border: 0;
}
#reset-button:focus:not(:hover) {
  background-color: #fff;
  box-shadow: none;
  border: 0;
}
#reset-label {
  color: $red-dark;
}
#reset-label:hover,
#reset-label:active,
#reset-label:visited {
  color: $red;
}
#results{
  font-style: italic;
}
#results-button, #results-button {
  border: 0;
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  background-color: $primary;
  color: $white;
  font-size: 1rem;
}
#results-button:hover {
  background-color: $primary-light;
  color: $white;
}
@media (min-width: $breakpoint-md) {
  hr {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
