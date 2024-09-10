<template>
  <div>
    <b-row class="social-media p-2 d-flex">
      <a @click="onFb" :href="facebook" target="_blank"
         v-if="facebook"
      >
        <b-col class="social">
          <icon-base :title="$t('common.facebook')" class="icon-35">
            <icon-facebook/>
          </icon-base>
        </b-col>
      </a>
      <a
        :href="twitter"
        target="_blank"
        v-if="twitter"
      >
        <b-col class="social">
          <b-col class="social">
            <icon-base :title="$t('common.twitter')" class="icon-35">
              <icon-twitter/>
            </icon-base>
          </b-col>
        </b-col></a>
      <a
        :href="instagram"
        target="_blank"
        v-if="instagram"
      >
        <b-col class="social">
          <icon-base :title="$t('common.instagram')" class="icon-35">
            <icon-instagram/>
          </icon-base>
        </b-col>
      </a>
      <a
        :href="youtube"
        target="_blank"
        v-if="youtube"
      >
        <b-col class="social">
          <icon-base :title="$t('common.youtube')" class="icon-35">
            <icon-youtube/>
          </icon-base>
        </b-col>
      </a>
      <a
        :href="vimeo"
        target="_blank"
        v-if="vimeo"
      >
        <b-col class="social">
          <icon-base :title="$t('common.vimeo')" class="icon-35">
            <icon-vimeo/>
          </icon-base>
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

.icon-35 {
  height: 35px;
  width: 35px;
}
</style>
