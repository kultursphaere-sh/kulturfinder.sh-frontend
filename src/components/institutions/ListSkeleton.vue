<template>
  <b-list-group v-show="true">
    <b-list-group-item
      v-for="skeleton in 8"
      :key="skeleton"
      class="list-item list-group-item-action skeleton-list"
    >
      <b-button
        pill
        variant="link"
        class="list-favorite-icon"
      >
        <icon-base
          :title="$t('navbar.saveAsFavorite')"
          class="m-auto icon-18"
          role="img"
        >
          <icon-favorite :filled="true"/>
        </icon-base>
      </b-button>
      <div
        class="li-container"
      >
        <div class="thumbnail-container">
          <div
            class="thumbnail bg-light"
            aria-hidden="true"
          />
        </div>
        <div class="text-container">
          <p class="pre-title py-3 rounded"/>
          <p class="pre-claim py-2 rounded">
            <span class="bg-light py-2 rounded"/>
          </p>
          <div class="d-flex">
            <span class="list-item-info mr-3">
              <icon-base
                :title="$t('common.distance')"
                class="mr-1 icon-18"
                role="img"
              >
                <icon-distance :aria-label="$t('common.distance')"/>
              </icon-base>
              <span class="py-2 px-3 bg-light rounded"/>
            </span>
            <div class="list-item-info">
              <icon-base
                :title="$t('dashboard.living-images')"
                class="icon-18"
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
            class="icon-22"
            role="img"
          >
            <icon-arrow-right :aria-label="$t('list.showDetails')"/>
          </icon-base>
        </div>
      </div>
    </b-list-group-item>
  </b-list-group>
</template>

<script>

export default {
  name: 'ListSkeleton'
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
  border-color: var(--light);
  border-style: solid;
}

.list-group-item-action:hover {
  background-color: var(--window-bg);
}

.list-group-item:first-child {
  border-top-color: transparent;
}

.list-group .list-group-item-action:active {
  background-color: var(--body-bg) ;
}
.li-container {
  min-height: 113px;
  display: flex;
  align-items: center;
  position: relative;
}
.list-favorite-icon{
  position: absolute;
  top: 0px;
  left: 0px;
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
  color: var(--primary);
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 8px;
}
.pre-title {
  display: block;
  background-color: var(--light);
  width: 120px;
  // height: 24px;
  margin-bottom: 8px;
}
.pre-claim{
  display: block;
  background-color: var(--light);
  width: 160px;
  // height: 12px;
}
.claim {
  display: block;
  color: var(--muted);
  font-size: 0.8rem;
  line-height: 1.08;
}
.list-item-info {
  display: flex;
  align-items: center;
  color: var(--muted);
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
