
<template>
  <b-list-group v-show="institutions">
    <b-list-group-item
      v-for="institution in institutions"
      :key="institution.id"
      class="list-item list-group-item-action"
    >
      <b-button
        pill
        variant="link"
        class="list-favorite-icon"
        @click="onFavoriteClick(institution)"
      >
        <icon-base
          :title="$t('navbar.saveAsFavorite')"
          color="#fff"
          width="18"
          height="18"
          class="m-auto"
          role="img"
          data-cy="favoriteButton"
        >
          <icon-favorite :filled="institution.isFavorite"/>
        </icon-base>
      </b-button>
      <router-link
        :to="`/${$route.params.locale}/institutions/list/details/${institution.name}`"
        class="li-container"
        data-cy="institutionsList"
      >
        <div class="thumbnail-container" v-if="institution.imageList && institution.imageList.thumbnail">
          <img
            :src="institution.imageList.thumbnail"
            class="thumbnail"
            aria-hidden="true"
            alt="Thumbnail"
          >
        </div>
        <div class="text-container">
          <p class="title">{{ institution.name | trimTitle }}</p>
          <p class="claim">
            <span v-if="institution.teaser">{{ institution.teaser }}</span>
          </p>
          <div class="d-flex">
            <span class="list-item-info mr-3" v-if="institution.distance">
              <icon-base
                :title="$t('common.distance')"
                color="#869094"
                width="18"
                height="18"
                class="mr-1"
                role="img"
              >
                <icon-distance :aria-label="$t('common.distance')"/>
              </icon-base>
              {{ $t("common.~") }}{{ institution.distanceText }}
            </span>
            <div class="list-item-info" v-if="institution.hasLivingImages">
              <icon-base
                :title="$t('dashboard.living-images')"
                width="18"
                height="18"
                color="#869094"
                role="img"
              >
                <icon-living-images/>
              </icon-base>
            </div>
          </div>
        </div>
        <div class="icon-container">
          <icon-base
            :title="$t('list.showDetails')"
            color="#869094"
            width="22"
            height="22"
            role="img"
          >
            <icon-arrow-right :aria-label="$t('list.showDetails')"/>
          </icon-base>
        </div>
      </router-link>
    </b-list-group-item>
  </b-list-group>
</template>

<script>

export default {
  name: 'ListRender',
  data() {
    return {
    }
  },
  props: {
    'institutions': {
      type: Array,
      default: () => []
    },
    'listType': {
      type: String,
      default: () => ''
    }
  },
  computed: {
    currentPath() {
      return this.listType || this.$route.path
    }
  },
  methods: {
    onFavoriteClick: async function (favInstitution) {
      await this.$store.dispatch('institutions/updateIsFavorite', favInstitution)
    }
  },
  mounted() {
    if (!this.listLoaded) {
      this.listLoaded = true
    }
  },
  filters: {
    trimTitle(title) {
      if (title.length > 46) {
        title = title.slice(0, 45) + '...'
      }
      return title
    }
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
  // height: 24px;
  margin-bottom: 8px;
}
.pre-claim{
  display: block;
  background-color: $light;
  width: 160px;
  // height: 12px;
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
