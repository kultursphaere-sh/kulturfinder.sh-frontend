<template>
  <div class="dashboard-carousel bg-light" data-cy="intitutionCarousel">
    <vue-slick-carousel
      v-bind="settings"
      class="carousel-slick"
      @beforeChange="beforeChange"
    >
      <div
        v-for="slide in slides"
        :key="slide.id"
        @mousedown="onMouseDown"
        @click="onClick"
        @touchstart="onMouseDown"
      >
        <b-img-lazy
          class="carousel-image"
          :srcset="`${slide.imageList.preview} 482w,
            ${slide.imageList.provided} 1031w`"
          sizes="(max-width: 482px) 482px,
            1031px"
          :src="slide.imageList.preview"
          :alt="slide.name"
          :title="`Weitere Infos zu: ${slide.name}`"
          :data-slide-id="slide.name"
          role="img"
          loading="lazy"
          draggable="false"
          v-bind="lazyProps"
        />
      </div>
    </vue-slick-carousel>

    <div
      id="distance-container"
      class="p-2 d-flex justify-content-center"
      :class="userPosition ? 'text-white' : 'no-gps'"
      @click="showGpsModal"
    >
      <icon-base
        :title="$t('common.distance')"
        class="mr-1 icon-17"
        role="img"
      >
        <icon-distance/>
      </icon-base>
      <span v-if="userPosition && currentSlide">{{ $t('common.~') }}{{ currentSlide.distanceText }}</span>
      <span v-else>{{ $t('dashboard.gpsDisabled') }}</span>
    </div>

    <b-container fluid class="pt-2 pb-3 text-center">
      <router-link
        :to="`/${$route.params.locale}/institutions/dashboard/details/${currentSlide ? currentSlide.name : null}`"
        id="slider-title"
      >
        {{ currentSlide ? currentSlide.name : nullValue }}
      </router-link>
    </b-container>
  </div>
</template>

<script>
import { shuffle } from 'lodash'
import { mapGetters } from 'vuex'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'Carousel',
  components: {
    'vue-slick-carousel': VueSlickCarousel
  },
  data() {
    return {
      lazyProps: {
        fluidGrow: true,
        blank: true,
        blankColor: '#bbb',
        /* This determines the width and height of the blank before the pictures get loaded in - for some reason those numbers work to make it responsive */
        width: 600,
        height: 338
      },
      curSlide: 0,
      settings: {
        'dots': false,
        'infinite': true,
        'centerMode': true,
        'adaptiveHeight': false,
        'slidesToScroll': 1,
        'slidesToShow': 1,
        'arrows': true,
        'focusOnSelect': true,
        'focusOnChange': true,
        'mobileFirst': true,
        'centerPadding': '250px',
        'responsive': [
          {
            'breakpoint': 991, // below LG screens
            'settings': {
              'centerPadding': '150px',
              'slidesToShow': 1
            }
          },
          {
            'breakpoint': 767, // below MD screens
            'settings': {
              'centerPadding': '50px',
              'slidesToShow': 1
            }
          }
        ]

      },
      numSlides: 5,
      nullValue: null
    }
  },
  props: {
    'institutions': {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      userPosition: 'userPosition/getPosition'
    }),
    slides() {
      if (this.institutions === null) {
        return [
          {
            id: '',
            imageList: {
              preview: ''
            },
            name: ''
          }
        ]
      }
      return (this.userPosition)
        ? this.institutions.slice(0, this.numSlides)
        : shuffle(this.institutions).slice(0, this.numSlides)
    },
    currentSlide() {
      return this.slides[this.curSlide]
    }
  },
  methods: {
    beforeChange(oldSlide, newSlide) {
      this.curSlide = newSlide
    },
    onClick(event) {
      const pageX = event.pageX || event.changedTouches[0].pageX
      const offset = this.lastScreenX - pageX

      if (offset > -10 && offset < 10) {
        this.$router.push(`/${this.$route.params.locale}/institutions/dashboard/details/${event.target.dataset.slideId}`)
      } else {
        event.preventDefault()
      }
    },
    onMouseDown(event) {
      this.lastScreenX = event.pageX || event.touches[0].pageX
    },
    showGpsModal(event) {
      if (!this.userPosition) this.$bvModal.show('no-gps-modal')
      else this.$router.push(`/${this.$route.params.locale}/institutions/dashboard/details/${this.currentSlide.id}`)
    }
  }
}
</script>

<style lang="scss">

@import "../../styles/_slick.scss";

.dashboard-carousel {
  position: relative;

  // TODO: NEEDS TO BE ADJUSTED WHEN MERGED WITH HIGH RES IMAGES
  .carousel-image {
    max-height: 350px;
    padding: 0 2px;
    height: 100%;
    border-radius: 0.75rem;
    object-fit: cover;
    cursor: pointer;
  }

  .carousel-main div img {
    height: 100%;
    object-fit: cover;
  }

  #slider-title {
    font-size: 15px;
    font-weight: 500;
  }

  #distance-container {
    border-radius: 0rem 0rem 0.75rem 0.75rem;
    background-color: var(--primary);
    color: var(--white);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: -0.21px;
    position: absolute;
    cursor: pointer;
    top: 0px;

    left: 60px;

    @media (min-width: $breakpoint-md) {
      left: 160px;
    }
    @media (min-width: $breakpoint-lg) {
      left: 260px;
    }
  }

  .no-gps {
    color: $warning !important;
  }

  .no-gps:hover,
  .no-gps:active {
    color: $warning-light !important;
  }
}

.icon-17 {
  height: 17px;
  width: 17px;
}
</style>
