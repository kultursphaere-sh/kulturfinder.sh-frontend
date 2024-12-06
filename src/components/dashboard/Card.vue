<template>
  <b-button
    variant="transparent"
    :to="route"
    :href="href"
    :class="{'ks-card-sm': small, 'ks-card-sm-mc': museumscardSmall, 'ks-card-mc': museumscard, 'ks-card-tc': ticket}"
    class="ks-card p-3 m-2 d-flex flex-column justify-content-center bg-light"
  >
    <div class="ks-card-icon-container">
      <img
        :src="imageSource"
        :alt="text"
        v-if="imageSource"
      >
      <icon-base
        :title="text"
        role="img"
        class="card-icon mx-auto icon-50"
        v-if="icon"
      >
        <component :is="icon"/>
      </icon-base>
    </div>
    <span class="ks-card-text">{{ text }}</span>
  </b-button>
</template>

<script>
export default {
  name: 'Card',
  props: {
    route: {
      type: String,
      default: ''
    },
    href: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    imageSource: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'left'
    },
    icon: {
      type: String,
      default: ''
    },
    small: {
      type: Boolean,
      default: false
    },
    museumscardSmall: {
      type: Boolean,
      default: false
    },
    museumscard: {
      type: Boolean,
      default: false
    },
    ticket: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.ks-card-text {
  font-weight: 500;
}
img, .card-icon {
  height: 100%;
  object-fit: contain;
}
.ks-card-icon-container {
  height: 60%;
}

.ks-card {
  width: 150px;
  height: 110px;
  border-radius: 7px;
  color: var(--primary);
}
.ks-card-sm {
  height: 80px !important;
}
.ks-card-sm-mc{
  .ks-card-icon-container {
    padding-top: 2px;
    height: 118%;
  }
}
.ks-card-mc{
  .ks-card-icon-container {
    padding-bottom: 3px;
    height: 52%;
  }
  .ks-card-text {
    font-weight: 500;
  }
}
.ks-card-tc{
  .ks-card-icon-container {
    padding-bottom: 7px;
  }
}

#living-images-card {
  width: 316px;
  height: 66px;
  border-radius: 7px;
}
.li-text-box {
  font-weight: 500;
  color: var(--primary) !important;
}
#living-images-icon {
  height: 100%;
}
.icon-50 {
  width: 50px;
}
@media (min-width: $breakpoint-md) {
  .ks-card {
    width: 200px;
  }
}
@media (max-width: 340px) {
  .ks-card {
    width: 40%;
  }
  img {
    width: 100%;
  }
  #living-images-card {
    width: 86%;
  }
}
</style>
