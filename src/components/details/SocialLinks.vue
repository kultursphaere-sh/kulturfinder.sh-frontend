<template>
  <div>
    <b-row class="social-media p-2 d-flex">
      <a @click="onFb" :href="facebook" target="_blank"
         v-if="facebook"
      >
        <b-col class="social">
          <img :alt="$t('common.facebook')" src="@/assets/images/icons/social-media/facebook.svg">
          <!-- <p>{{ $t("common.facebook") }}</p> -->
        </b-col>
      </a>
      <a
        :href="twitter"
        target="_blank"
        v-if="twitter"
      >
        <b-col class="social">
          <img :alt="$t('common.twitter')" src="@/assets/images/icons/social-media/twitter.svg">
          <!-- <p>{{ $t("common.twitter") }}</p> -->
        </b-col>
      </a>
      <a
        :href="instagram"
        target="_blank"
        v-if="instagram"
      >
        <b-col class="social">
          <img :alt="$t('common.instagram')" src="@/assets/images/icons/social-media/instagram.svg">
          <!-- <p>{{ $t("common.instagram") }}</p> -->
        </b-col>
      </a>
      <a
        :href="youtube"
        target="_blank"
        v-if="youtube"
      >
        <b-col class="social">
          <img :alt="$t('common.youtube')" src="@/assets/images/icons/social-media/youtube.svg">
          <!-- <p>{{ $t("common.youtube") }}</p> -->
        </b-col>
      </a>
      <a
        :href="vimeo"
        target="_blank"
        v-if="vimeo"
      >
        <b-col class="social">
          <img :alt="$t('common.vimeo')" src="@/assets/images/icons/social-media/vimeo.svg">
          <!-- <p>{{ $t("common.vimeo") }}</p> -->
        </b-col>
      </a>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'SocialLinks',
  props: {
    facebook: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    youtube: {
      type: String,
      default: ''
    },
    vimeo: {
      type: String,
      default: ''
    }
  },
  methods: {
    isAndroid() {
      return navigator.userAgent.match(/Android/i)
    },
    onFb() {

      // Wir bräuchten die IDs aller FB Seiten, wenn wir in Android Deeplinken wollen!

      /* let applink = this.facebook;
      if (this.isAndroid()) {
        this.test = true;
        applink = "fb://page/832220053592980";
      }
      window.open(applink, '_blank');
      setTimeout(() => {
        if (document.hasFocus()) window.open(this.facebook, '_blank');
      }, 25); */
    }
  }

}
</script>

<style scoped>
.social p {
  margin-top: 1vh;
  font-size: 1rem;
  text-align: center;
}
</style>
