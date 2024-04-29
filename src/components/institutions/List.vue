<template>
  <div class="list">
    <vue-headful
      v-if="changeTitle"
      :title="(this.$store.state.filters.isFavorite ? $t('common.favorites') : $t('common.list')) + ' | ' + appName"
      :description="appDescription"
      :keywords="appKeywords"
      :lang="`/${$route.params.locale}/`"
      og-locale="de"
      :url="appURL"
    />
    <list-render :institutions="institutions" :list-type="listType"/>
    <scroll-to-top-button display-height="1000"/>
  </div>
</template>

<script>
import ScrollPosition from '@/mixins/scrollposition'
import ScrollToTopButton from '@/components/institutions/ScrollToTopButton.vue'
import ListSkeleton from '@/components/institutions/ListSkeleton.vue'

const ListRender = () => ({
  // The component to load (should be a Promise)
  component: import(/* webpackChunkName: "ListRender" */ '@/components/institutions/ListRender'),
  // A component to use while the async component is loading
  loading: ListSkeleton,
  // A component to use if the load fails
  error: ListSkeleton,
  // Delay before showing the loading component. Default: 200ms.
  delay: 0,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 10000
})

export default {
  name: 'List',
  data() {
    return {
      curId: ''
    }
  },
  mixins: [ScrollPosition],
  props: {
    'institutions': {
      type: Array,
      default: () => []
    },
    'listType': {
      type: String,
      default: () => ''
    },
    'changeTitle': {
      type: Boolean,
      default: true
    }
  },
  computed: {
    currentPath() {
      return this.listType || this.$route.path
    },
    appURL: function () { return process.env.VUE_APP_URL },
    appName: function () { return process.env.VUE_APP_NAME },
    appDescription: function () { return process.env.VUE_APP_DESCRIPTION },
    appKeywords: function () { return process.env.VUE_APP_KEYWORDS },
    tenant: function () { return process.env.VUE_APP_TENANT }
  },
  methods: {
    onFavoriteClick: async function (favInstitution) {
      await this.$store.dispatch('institutions/updateIsFavorite', favInstitution)
    }
  },
  filters: {
    trimTitle(title) {
      if (title.length > 46) {
        title = title.slice(0, 45) + '...'
      }
      return title
    }
  },
  components: {
    ScrollToTopButton,
    ListRender
  }
}
</script>

<style lang="scss" scoped>

#search-preview {
  display: flex; // Set flex here and not as bootstrap class to enable v-show display toggling

  &:not(.show-more-results-button) .list-group-item:last-child {
    border-bottom: 0;
  }

  &.show-more-results-button .list-group-item:last-child {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  @media (max-width: $breakpoint-sm) {
    .li-container {
      min-height: 72px;
    }
    .btn.list-favorite-icon {
      display: none;
    }
    .thumbnail-container {
      display: none;
    }
    .text-container {
      padding: 8px;
    }
  }
}

.list-group{
  width: 100%;
}
.list-group-item {
  padding: 0;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-color: #d7e0e5;
  border-style: solid;
}

.list-group-item:first-child {
  border-top-color: transparent;
}

.list-group-item-action:active {
  background-color: #f1f4f6;
}
.li-container {
  min-height: 113px;
  display: flex;
  align-items: center;
  position: relative;
}
.list-favorite-icon{
  position: absolute;
  z-index: 100;
  width: 45px;
}
.thumbnail-container {
  max-width: 200px;
  width: 35%;
}
.thumbnail {
  max-width: 200px;
  width: 35%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}
.text-container {
  padding: 15px 10px 15px 18px;
  height: 100%;
  flex: 1;
}
.icon-container {
  padding-right: 14px;
}
.title {
  display: block;
  color: #3c4d61;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 8px;
}
.pre-title {
  display: block;
  background-color: $light;
  width: 120px;
  margin-bottom: 8px;
}
.pre-claim{
  display: block;
  background-color: $light;
  width: 160px;
}
.claim {
  display: block;
  color: #576165;
  font-size: 0.8rem;
  line-height: 1.08;
}
.list-item-info {
  display: flex;
  align-items: center;
  color: #576165;
  font-size: 0.7rem;
  margin-bottom: 0;
}
.skeleton-list {
  animation: pulse 2s infinite;
  -webkit-animation: pulse 2s infinite;
}

@keyframes pulse {
  0%   { opacity: 1 }

  50%  { opacity: 0.3 }

  100% { opacity: 1 }
}

@-webkit-keyframes pulse {
  0%   { opacity: 1 }

  50%  { opacity: 0.3 }

  100% { opacity: 1 }
}
</style>
