<template>
  <b-button
    :to="route"
    :href="href"
    :class="{'ks-card-sm': small, 'ks-card-sm-mc': museumscardSmall, 'ks-card-mc': museumscard, 'ks-card-tc': ticket}"
    class="ks-card p-3 m-2 bg-white d-flex flex-column justify-content-center"
  >
    <div class="ks-card-icon-container">
      <img
        :src="imageSource"
        :alt="text"
        v-if="imageSource"
      >
      <icon-base
        :title="text"
        width="50"
        height="50"
        color="#003064"
        role="img"
        class="card-icon mx-auto"
        v-if="icon"
      >
        <component :is="'icon-' + icon"/>
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
  color: $primary;
}
img, .card-icon {
  height: 100%;
}
.ks-card-icon-container {
  height: 60%;
}

.ks-card {
  width: 150px;
  height: 110px;
  border-radius: 7px;
}
.ks-card-sm {
  height: 80px !important;
}
.ks-card-sm-mc{
  .ks-card-icon-container {
    height: 90%;
  }
}
.ks-card-mc{
  .ks-card-icon-container {
    height: 68%;
  }
  .ks-card-text {
    font-weight: 400;
    color: $primary;
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
  color: $primary !important;
}
#living-images-icon {
  height: 100%;
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
  #living-images-card {
    width: 86%;
  }
}
</style>
