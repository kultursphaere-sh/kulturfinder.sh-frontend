<template>
  <div class="detail-carousel">
    <vue-slick-carousel
      v-bind="settings"
      class="carousel-slick"
      @beforeChange="beforeChange"
      :style="slides.length + video.length > 1 ? '' : 'pointer-events: none;'"
    >
      <div
        v-for="(image, index) in slides"
        :key="image.title"
        class="audio-slider-container"
      >
        <img
          class="carousel-image"
          :id="`banner-${index}`"
          :class="`banner-${index}`"
          :srcset="`${image.imageList.preview} 482w,
            ${image.imageList.provided} 1031w`"
          sizes="(max-width: 482px) 482px,
            1031px"
          :src="image.imageList.preview"
          :alt="image.title"
          :title="image.title"
          @mousedown="onMouseDown"
          @touchstart="onMouseDown"
          role="img"
          loading="lazy"
          draggable="false"
        >
        <!-- AUDIO SECTION -->
        <div
          class="audio-button-inner-container"
          v-if="image.audio"
        >
          <b-button
            @click="onPlaybuttonClick(index)"
            v-if="!image.audioPlayerVisible"
            pill
            class="playbutton-button"
          >
            <icon-base class="playbutton-icon">
              <icon-video/>
            </icon-base>
          </b-button>
          <audio
            controls
            controlsList="nodownload"
            :src="image.audio.label"
            v-if="image.audioPlayerVisible"
            class="audio-field"
            autoplay
          />
        </div>
        <!-- VIDEO SECTION -->
        <div
          class="video-playbutton-container"
          v-if="image.video"
        >
          <b-button
            @click="onVideoPlayButtonClick(index)"
            v-if="!image.videoPlayerVisible"
            pill
            class="video-playbutton-button"
          >
            <icon-base class="video-playbutton-icon">
              <icon-video/>
            </icon-base>
          </b-button>
          <video
            controls
            controlsList="nodownload"
            :src="image.video.label"
            v-if="image.videoPlayerVisible"
            type="video"
            class="video-object"
            autoplay
          />
          <img
            id="videobcg"
            alt="background-box"
            src="@/assets/images/pwa-modal/placeholder-box.png"
            v-if="image.videoPlayerVisible"
          >
        </div>
      </div>
    </vue-slick-carousel>
  </div>
</template>

<script>
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
      curImage: 0,
      settings: {
        'dots': true,
        'infinite': false,
        'centerMode': true,
        'adaptiveHeight': false,
        'slidesToScroll': 1,
        'slidesToShow': 1,
        'arrows': true,
        'focusOnSelect': true,
        'focusOnChange': true,
        'mobileFirst': true,
        'centerPadding': '0px'
      },
      numSlides: 5,
      slides: []
    }
  },
  props: {
    'images': {
      type: Array,
      default: () => []
    },
    'audio': {
      type: Array,
      default: () => []
    },
    'video': {
      type: Array,
      default: () => []
    }
  },
  computed: {
    currentSlide() {
      return this.slides[this.curImage]
    }
  },
  methods: {
    beforeChange(oldSlide, newSlide) {
      this.curImage = newSlide
    },
    onMouseDown(event) {
      this.lastScreenX = event.pageX || event.touches[0].pageX
    },
    showGpsModal(event) {
      if (!this.userPosition) this.$bvModal.show('no-gps-modal')
      else this.$router.push(`/${this.$route.params.locale}/images/dashboard/details/${this.currentSlide.id}`)
    },
    onPlaybuttonClick(id) {
      this.slides[id].audioPlayerVisible = true
      this.$forceUpdate()
    },
    onVideoPlayButtonClick(id) {
      this.slides[id].videoPlayerVisible = true
      this.$forceUpdate()
    }
  },
  created() {
    this.slides = this.images
    for (let audioItem of this.audio) {
      this.slides[audioItem.identifier].audioPlayerVisible = false
      this.slides[audioItem.identifier].audio = audioItem
    }
    for (let videoItem of this.video) {
      this.slides[videoItem.identifier].videoPlayerVisible = false
      this.slides[videoItem.identifier].video = videoItem
    }
  }
}
</script>

<style lang="scss">

@import "../../styles/_slick.scss";

.detail-carousel {
  position: relative;
  background-color: (--light);

  // TODO: NEEDS TO BE ADJUSTED WHEN MERGED WITH HIGH RES IMAGES
  .carousel-image {
    min-height: 200px;
    max-height: 450px;
    height: 100%;
    object-fit: cover;
    width: 100%;
    z-index: -1;
  }

  .carousel-main div img {
    height: 100%;
    object-fit: cover;
  }
  #slider-title{
    font-size: 15px;
    font-weight: 500;
  }
}

//Audio CSS
.audio-slider-container {
  position: relative;
  width: 100%;
}
.audio-button-inner-container {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}
.audio-field {
  transform: scale(0.8);
  width: 90%;
  bottom: 10%;
  position: absolute;
  opacity: 0.8;
}

.playbutton-icon {
  width: 200%;
  height: 200%;
  position: absolute;
}
.playbutton-button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15%;
  height: 20%;
  opacity: 0.9;
}
//Video CSS
.video-slider-container {
  position: relative;
  width: 100%;
}
.video-image {
  min-height: 200px;
  max-height: 450px;
  height: 100%;
  object-fit: cover;
  width: 100%;
  opacity: 0.8;
}

.video-playbutton-container {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.video-playbutton-button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15%;
  height: 20%;
  opacity: 0.9;
}
.video-playbutton-icon {
  width: 200%;
  height: 200%;
  position: absolute;
}
.video-object {
 min-height: 200px;
 max-height: 450px;
 /* height: 100%; */
 width: 100%;
 position: relative;
 z-index:1;
}
//lifts up the timeline so it doesnt get blocked by the slider-dots
video::-webkit-media-controls-timeline {
  margin-bottom: 10px;
}
#videobcg {
   position: absolute;
   top: 0px;
   left: 0px;
   min-height: 200px;
   max-height: 450px;
   width: 100%;
   height: 100%;
   z-index: 0;

}

</style>
