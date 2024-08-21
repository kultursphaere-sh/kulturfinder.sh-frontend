<template>
  <div id="about">
    <vue-headful
      :title="$t('navbar.aboutUs') + ' | ' + appName"
      :description="appDescription"
      :keywords="appKeywords"
      :lang="`${locale}`"
      og-locale="de"
      :url="appURL"
    />
    <ks-header :header-title="$t('navbar.aboutUs')">
      <template #right>
        <!-- Home Button -->
        <b-nav-item router-link :to="`/${locale}`">
          <icon-base title="HomeButton" class="icon-20">
            <icon-home/>
          </icon-base>
        </b-nav-item>
      </template>
    </ks-header>

    <div id="main-container" v-scroll-lock="true">
      <div id="main-content">
        <b-container class="p-4">
          <b-container class="about-logo">
            <img :alt="$t('navbar.logo')" id="logo" class="img-light"
                 :src="'/' + tenant + '/img/logos/kf_logo_light.png'"
            >
            <img :alt="$t('navbar.logo')" id="logo" class="img-dark"
                 :src="'/' + tenant + '/img/logos/kf_logo_dark.png'"
            >
          </b-container>
          <hr>
          <b-row class="social-media">
            <a href="https://www.facebook.com/kultursphaere" target="_blank">
              <b-col class="social">
                <icon-base :title="$t('common.facebook')" class="icon-35">
                  <icon-facebook/>
                </icon-base>
              </b-col>
            </a>
            <a href="https://twitter.com/kultursphaere" target="_blank">
              <b-col class="social">
                <icon-base :title="$t('common.twitter')" class="icon-35">
                  <icon-twitter/>
                </icon-base>
              </b-col>
            </a>
            <a href="http://www.instagram.com/kultursphaere" target="_blank">
              <b-col class="social">
                <icon-base :title="$t('common.instagram')" class="icon-35">
                  <icon-instagram/>
                </icon-base>
              </b-col>
            </a>
          </b-row>
          <p v-if="tenant === 'sh'" class="mt-4">
            {{ $t('about.description') }}
          </p>
          <section id="partners" class="py-3">
            <b-row align-v="center" align-h="center">
              <b-col
                :cols="partner.small
                  ? '3'
                  : '6'"
                :sm="partner.small
                  ? '2'
                  : '4'"
                v-for="partner in partners"
                :key="partner.name"
                class="h-100 my-4"
              >
                <a
                  :href="partner.link"
                  target="_blank"
                  :title="partner.name"
                >
                  <img
                    :alt="partner.name"
                    :src="partner.src"
                    :class="partner.class"
                    class="w-100"
                  >
                </a>
              </b-col>
            </b-row>
          </section>
          <section v-if="tenant === 'sh'">
            <h2 class="mt-4">{{ $t('about.leadingLegal') }}</h2>
            <p>
              {{ $t('about.address0') }}<br>
              {{ $t('about.address1') }}<br>
              {{ $t('about.address2') }}<br>
              {{ $t('about.address3') }}
            </p>
            <h2 class="mt-4">{{ $t('common.contact') }}</h2>
            <p>
              <span class="contact">
                <icon-base
                  :title="$t('common.website')"
                  class="mr-2"
                  role="img"
                >
                  <icon-globe/>
                </icon-base>
                <a :href="'https://' + $t('common.www')" target="_blank">
                  {{ $t('common.www') }}
                </a>
              </span>
              <span class="contact">
                <icon-base
                  title="Email-Adresse"
                  class="mr-2"
                  role="img"
                >
                  <icon-mail/>
                </icon-base>
                <a :href="'mailto:' + $t('common.mailto')">
                  {{ $t('common.mailto') }}
                </a>
              </span>
            </p>
          </section>
          <section v-if="tenant === 'hb'">
            <h2 class="mt-4">{{ $t('about.imprint') }}</h2>
            <p>
              {{ $t('about.hb.imprint0') }}<br>
              {{ $t('about.hb.imprint1') }}<br>
              {{ $t('about.hb.imprint2') }}<br>
            </p>
            <p>
              {{ $t('about.hb.imprint3') }}<br>
              {{ $t('about.hb.imprint4') }}<br>
              {{ $t('about.hb.imprint5') }}<br>
              {{ $t('about.hb.imprint6') }}<br>
              {{ $t('about.hb.imprint7') }}<br>
            </p>
            <p>
              {{ $t('about.hb.imprint8') }}<br>
            </p>
            <h2 class="mt-4">{{ $t('common.contact') }}</h2>
            <p>
              <span class="contact">
                <icon-base
                  :title="$t('common.website')"
                  class="mr-2"
                  role="img"
                >
                  <icon-globe/>
                </icon-base>
                <a :href="'https://dataport.de'" target="_blank">
                  {{ $t('about.hb.imprint9') }}<br>
                </a>
              </span>
              <span class="contact">
                <icon-base
                  title="Email-Adresse"
                  class="mr-2"
                  role="img"
                >
                  <icon-mail/>
                </icon-base>
                <a :href="'mailto:kulturfinder@dataport.de'">
                  {{ $t('about.hb.imprint10') }}<br>
                </a>
              </span>
            </p>
          </section>
          <section v-if="tenant === 'sh'">
            <h2 class="mt-4">{{ $t('about.privacy') }}</h2>
            <p>
              {{ $t('about.noThirdParties') }}
            </p>
          </section>
          <section v-if="tenant === 'hb'">
            <h2 class="mt-4">{{ $t('about.privacy') }}</h2>
            <p>
              {{ $t('about.hb.privacy00') }}<br>
              {{ $t('about.hb.privacy01') }}<br>
              {{ $t('about.hb.privacy02') }}<br>
              <br>
              {{ $t('about.hb.privacy03') }}<br>
              {{ $t('about.hb.privacy04') }}<br>
              {{ $t('about.hb.privacy05') }}<br>
              {{ $t('about.hb.privacy06') }}<br>
              {{ $t('about.hb.privacy07') }}<br>
              {{ $t('about.hb.privacy08') }}<br>
              {{ $t('about.hb.privacy09') }}<br>
              {{ $t('about.hb.privacy10') }}<br>
              {{ $t('about.hb.privacy11') }}<br>
              {{ $t('about.hb.privacy12') }}<br>
              {{ $t('about.hb.privacy13') }}<br>
              <br>
              {{ $t('about.hb.privacy14') }}<br>
              <br>
              {{ $t('about.hb.privacy15') }}<br>
              {{ $t('about.hb.privacy16') }}<br>
              {{ $t('about.hb.privacy17') }}<br>
              {{ $t('about.hb.privacy18') }}<br>
              {{ $t('about.hb.privacy19') }}<br>
              {{ $t('about.hb.privacy20') }}<br>
              <br>
              {{ $t('about.hb.privacy21') }}<br>
              <br>
              {{ $t('about.hb.privacy22') }}<br>
              {{ $t('about.hb.privacy23') }}<br>
              <br>
              {{ $t('about.hb.privacy24') }}<br>
              {{ $t('about.hb.privacy25') }}<br>
              <br>
              {{ $t('about.hb.privacy26') }}<br>
              {{ $t('about.hb.privacy27') }}<br>
              <br>
              {{ $t('about.hb.privacy28') }}<br>
              {{ $t('about.hb.privacy29') }} <a href="https://www.dataport.de/kontakt/">{{ $t('about.hb.privacy30') }}</a><br>
              <br>
              {{ $t('about.hb.privacy31') }}<br>
              {{ $t('about.hb.privacy32') }}<br>
              {{ $t('about.hb.privacy33') }}<br>
              {{ $t('about.hb.privacy34') }}<br>
              {{ $t('about.hb.privacy35') }}<br>
            </p>
          </section>
          <section v-if="matomoActive">
            <h2 class="mt-4">{{ $t('about.matomo') }}</h2>
            <b-form-checkbox
              v-model="analyticsConsent"
              name="analytics-checkbox"
              @change="changeAnalyticsConsent()"
              class="mb-3"
            >
              <span>{{ $t('about.matomoConsent') }}</span>
            </b-form-checkbox>
            <p>
              {{ $t('about.matomoDescription') }}
            </p>
            <p>
              {{ $t('about.matomoDescription2') }}
            </p>
            <h2 class="mt-4">{{ $t('about.legalNotice') }}</h2>
            <p>
              {{ $t('about.legalNoticeDescription') }}
            </p>
            <ul>
              <li>{{ $t('about.legalNoticePoint1') }}</li>
              <li>{{ $t('about.legalNoticePoint2') }}</li>
              <li>{{ $t('about.legalNoticePoint3') }}</li>
              <li>{{ $t('about.legalNoticePoint4') }}</li>
              <li>{{ $t('about.legalNoticePoint5') }}</li>
              <li>{{ $t('about.legalNoticePoint6') }}</li>
              <li>{{ $t('about.legalNoticePoint7') }}</li>
            </ul>
            <span>{{ $t('about.legalNoticeProducedBy') }}</span>
            <h2 class="mt-4">{{ $t('about.positionRelatedData') }}</h2>
            <p>
              {{ $t('about.positionRelatedDataProcessing') }}
            </p>
          </section>
          <section>
            <h2 class="mt-4">{{ $t('licenses.licenses') }}</h2>
            <router-link :to="`/${$route.params.locale}/licenses`">
              {{ $t('licenses.oss-third-party') }}
            </router-link>
          </section>
          <section v-if="$route.params.locale === 'de'">
            <h2 class="mt-4">{{ $t('about.accessibility.declarationsHeadline') }}</h2>
            <p>
              {{ $t('about.accessibility.LBGG_BITV') }}
            </p>
            <h3>{{ $t('about.accessibility.currentStatusHeadline') }}</h3>
            <p>
              {{ $t('about.accessibility.currentStatus') }}
            </p>
            <ul>
              <li>{{ $t('about.accessibility.faults.0') }}</li>
              <li>{{ $t('about.accessibility.faults.1') }}</li>
            </ul>
            <p>
              {{ $t('about.accessibility.correcting') }}
            </p>
            <h3>{{ $t('about.accessibility.declarationCreatedHeadline') }}</h3>
            <p>
              {{ $t('about.accessibility.declarationCreated') }}
            </p>
            <h3>{{ $t('about.accessibility.feedbackHeadline') }}</h3>
            <p>
              {{ $t('about.accessibility.feedbackExplanation') }}
            </p>
            <h3>{{ $t('about.accessibility.complaintsOfficeHeadline') }}</h3>
            <p>{{ $t('about.accessibility.complaintsOfficeExplanation') }}</p>
            <p>
              {{ $t('about.accessibility.complaintsOffice.name') }}<br>
              {{ $t('about.accessibility.complaintsOffice.street') }}<br>
              {{ $t('about.accessibility.complaintsOffice.city') }}<br>
              {{ $t('about.accessibility.complaintsOffice.phone') }}<br>
              {{ $t('about.accessibility.complaintsOffice.email') }}
            </p>
          </section>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import KsHeader from '@/components/layout/Header.vue'
import ScrollPosition from '@/mixins/scrollposition'
import i18n from '@/i18n'

export default {
  name: 'About',
  data() {
    return {
      analyticsConsent: false,
      partners: [
        {
          name: 'Fachhochschule Kiel',
          src: require('@/assets/images/logos/logo_fh-kiel.png'),
          small: false,
          class: '',
          link: 'https://www.fh-kiel.de/'
        },
        {
          name: 'Schleswig-Holsteinische Landesbibliothek',
          src: require('@/assets/images/logos/logo_shlb.png'),
          small: false,
          class: 'px-4',
          link: 'http://www.shlb.de/'
        },
        {
          name: 'digiCULT',
          src: require('@/assets/images/logos/logo_digicult.png'),
          small: false,
          class: '',
          link: 'https://www.digicult-verbund.de/'
        },
        {
          name: 'Dataport',
          src: require('@/assets/images/logos/logo_dataport.png'),
          small: false,
          class: 'px-4',
          link: 'https://www.dataport.de/'
        },
        {
          name: 'Museumsverband',
          src: require('@/assets/images/logos/logo_museumsverband.png'),
          small: true,
          class: '',
          link: 'http://www.museumsverband-shhh.de/'
        }
      ]
    }
  },
  mounted() {
    const checkConsentCookie = this.getCookie('CookieConsent')
    this.analyticsConsent = checkConsentCookie !== 'false'
  },
  computed: {
    matomoActive: function () { return process.env.VUE_APP_MATOMO === 'true' },
    appURL: function () { return process.env.VUE_APP_URL },
    appName: function () { return process.env.VUE_APP_NAME },
    appDescription: function () { return process.env.VUE_APP_DESCRIPTION },
    appKeywords: function () { return process.env.VUE_APP_KEYWORDS },
    tenant: function () { return process.env.VUE_APP_TENANT },
    locale: function () { return i18n.locale }
  },
  methods: {
    changeAnalyticsConsent() {
      // Change The Cookie Consent
      this.analyticsConsent = !this.analyticsConsent
      if (this.analyticsConsent) {
        // changed to true
        let expireDate = new Date()
        expireDate.setTime(expireDate.getTime() + (50 * 365 * 24 * 60 * 60 * 1000))
        document.cookie = 'CookieConsent=true; expires=' + expireDate.toUTCString() + '; path=/;'

        // Reload Site
        // Matomo is working on this issue here: https://github.com/matomo-org/matomo/issues/13056
        window.location.reload(true)
      } else {
        // changed to false

        // Create Deny Cookie
        document.cookie = 'CookieConsent=false; expires=; path=/;'

        // Reload Site
        // Matomo is working on this issue here: https://github.com/matomo-org/matomo/issues/13056
        window.location.reload(true)
      }
    },
    getCookie(cname) {
      const name = cname + '='
      const ca = document.cookie.split(';')
      for (const element of ca) {
        let c = element
        while (c.startsWith(' ')) {
          c = c.substring(1)
        }
        if (c.startsWith(name)) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    }
  },
  components: {
    KsHeader
  },
  mixins: [ScrollPosition]
}
</script>

<style scoped>
.about-logo {
  display: flex;
  justify-content: center;
  align-content: center;
}

.social-media {
  display: flex;
  justify-content: center;
  padding: 2% 10% 2% 10%;
}

.social {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

#logo {
  max-height: 75px;
}

.dark #partners div {
  background-color: var(--body-color);
}

.contact {
  display: flex;
  align-items: center;
}

.icon-35 {
  height: 35px;
  width: 35px;
}

.icon {
  color: var(--primary)
}
</style>
