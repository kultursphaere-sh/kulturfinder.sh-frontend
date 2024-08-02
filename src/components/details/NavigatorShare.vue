<template>
  <div class="navigator-share">
    <b-button
      variant="themed"
      pill
      class="labeled-button"
      @click="share()"
    >
      <icon-base
        :title="$t('details.share')"
        class="m-auto icon-20"
        role="img"
      >
        <icon-share/>
      </icon-base>
      <label class="labeled-button-label" data-cy="shareLabel">{{ $t("details.share") }}</label>
    </b-button>
    <b-modal
      ref="fallback-modal"
      ok-only
      ok-title="Okay"
      centered
      id="fallback-modal"
      :title="$t('details.share')"
      data-cy="socialPopUp"
    >
      <b-button class="fallback-social-button">
        <facebook
          :url="this.url"
          :title="$t('details.shareSubject')"
          scale="2"
          data-cy="facebookSocial"
        />
      </b-button>
      <b-button class="fallback-social-button">
        <twitter
          :url="this.url"
          :title="$t('details.shareSubject')"
          scale="2"
          data-cy="twitterSocial"
        />
      </b-button>
      <b-button class="fallback-social-button">
        <telegram
          :url="this.url"
          :title="$t('details.shareSubject')"
          scale="2"
          data-cy="telegramSocial"
        />
      </b-button>
      <b-button class="fallback-social-button">
        <whats-app
          :url="this.url"
          :title="$t('details.shareSubject')"
          scale="2"
          data-cy="whatsappSocial"
        />
      </b-button>
      <b-button class="fallback-social-button">
        <email
          :url="this.url"
          :subject="$t('details.shareSubject')"
          scale="2"
          data-cy="emailSocial"
        />
      </b-button>
    </b-modal>
  </div>
</template>

<script>
import { Email, Facebook, Telegram, Twitter, WhatsApp } from 'vue-socialmedia-share'

export default {
  name: 'NavigatorShare',
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  methods: {
    share() {
      const data = {
        title: this.title,
        text: this.text,
        url: this.url
      }
      if (navigator.share) {
        navigator.share(data)
          .then(succ => {
            if (succ) {
              console.log('Geteilt!', succ)
            }
          })
          .catch(err => {
            console.error('Fehler beim Teilen', err)
          })
      } else {
        this.$refs['fallback-modal'].show()
      }
    }
  },
  components: {
    Facebook,
    Twitter,
    Telegram,
    WhatsApp,
    Email
  }
}
</script>
<style>
.navigator-share .modal-body {
  text-align: center;
  padding: 2rem;
}
.navigator-share .fallback-social-button {
  padding: 0;
  margin: 0.5rem;
}
.navigator-share .fallback-social-button svg {
  height: 50px !important;
  width: 50px !important;
  margin: -3px;
}
</style>
