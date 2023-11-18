<template>
  <div id="details">
    <vue-headful
      :title="(institution.name ? institution.name : $t('common.loading')) + ' | ' + $t('SEO.title')"
      :description="institution.claim + ' - ' + institution.description + ' || ' + $t('SEO.description')"
      :keywords="$t('SEO.commonKeywords') + ', '+ institution.tags + ', '+ institution.categories"
      :lang="`/${$route.params.locale}/`"
      og-locale="de"
      url="https://kulturfinder.sh"
    />
    <ks-header>
      <template #center>
        <b-nav-item router-link :to="`/${$route.params.locale}/`">
          <img
            height="40px"
            class="logo p-0"
            src="@/assets/images/logos/kf_logo.png"
            :alt="$t('navbar.logo')"
            role="img"
            data-cy="kulturfinderLogo"
          >
        </b-nav-item>
      </template>
      <template class="d-flex" #right>
        <b-button pill class="labeled-button mr-1" @click="onFavoriteClick">
          <icon-base
            :title="$t('navbar.saveAsFavorite')"
            color="#003064"
            width="18"
            height="18"
            class="m-auto"
            role="img"
            data-cy="favoriteButton"
          >
            <icon-favorite :filled="institution.isFavorite"/>
          </icon-base>
          <label class="labeled-button-label">{{ $t("details.favorite") }}</label>
        </b-button>
        <navigator-share
          :url="sharingUrl"
          :title="sharingTitle"
          :text="$t('details.shareSubject')"
          data-cy="shareButton"
        />
      </template>
    </ks-header>

    <div id="main-container" v-scroll-lock="true">
      <div id="main-content" class="position-relative">
        <skeleton-screen v-if="loading"/>
        <ks-carousel
          v-if="institution.images && institution.images.length"
          :images="institution.images"
          :audio="institution.audio"
          :video="institution.video"
          data-cy="imageCarousel"
        />
        <template v-if="!loading">
          <b-container class="w-md-90 px-4 pt-4 pt-sm-5 pb-3">
            <!-- Headline -->
            <div class="headline text-primary" data-cy="institutionHeadline">
              <h2 class="mb-1">{{ institution.name }}</h2>
              <p id="claim" v-if="institution.claim">
                {{ institution.claim }}
              </p>
            </div>
            <b-row>
              <!-- Description -->
              <b-col data-cy="institutionDescription">
                <p class="m-0" v-if="institution.description">{{ institution.description }}</p>
                <p class="m-0 mt-3" v-else>{{ $t('details.noDescription') }}</p>
              </b-col>

              <!-- MuseumsCard MD+ -->
              <b-col
                v-if="museumsCardEnabled && institution.tags && institution.tags.includes('MuseumsCard')"
                cols="12"
                md="5"
                class="d-none d-md-block"
                data-cy="museumsCard"
              >
                <hr class="mb-4 mt-5 d-md-none">
                <museums-card class="mt-5 mt-md-0"/>
              </b-col>
            </b-row>
          </b-container>
          <!-- Living Images -->
          <section
            class="w-100"
            id="living-images-info"
            v-if="institution.hasLivingImages"
          >
            <b-container class="p-4 my-4">
              <b-row wrap>
                <b-col md="7" class="mb-3 mb-md-0">
                  <h3>{{ $t('details.livingImagesTitle') }}</h3>
                  <p class="mb-md-0">{{ $t('details.livingImagesDescription') }}</p>
                </b-col>
                <b-col md="5" class="d-flex align-items-center justify-content-center justify-content-md-right">
                  <b-button
                    id="li-button"
                    class="px-4"
                    :to="`/${$route.params.locale}/institutions/${listType}/details/${actId}/living-images`"
                    :disabled="!livingImagesEnabled"
                  >
                    {{ $t('details.livingImagesCallToAction') }}
                    <img
                      :alt="$t('dashboard.living-images')"
                      class="li-image ml-2"
                      src="@/assets/images/icons/livingP.svg"
                    >
                  </b-button>
                </b-col>
              </b-row>
              <b-row v-if="!livingImagesEnabled">
                <b-col class="mt-4 mt-md-3">
                  <b-alert
                    show
                    variant="danger"
                    class="warning"
                  >
                    <b-row>
                      <b-col class="col-auto pr-0">
                        <icon-base width="20" height="20">
                          <icon-error/>
                        </icon-base>
                      </b-col>
                      <b-col>
                        <span v-if="!detectRTC.isMobileDevice">{{ $t('details.livingImagesIsDesktop') }}</span>
                        <span v-else-if="isIOSWebAppWrongVersion">{{ $t('details.livingImagesIOSWebAppWrongVersion') }}</span>
                        <span v-else>{{ $t('details.livingImagesNotSupported') }}</span>
                      </b-col>
                    </b-row>
                  </b-alert>
                </b-col>
              </b-row>
            </b-container>
          </section>
          <hr v-else class="my-4">
          <b-container class="px-4">
            <!-- Navigation -->
            <section id="navigation" class="py-3" data-cy="navigation">
              <div class="row p-0 m-0 justify-content-between">
                <!-- Show on Map -->
                <info-detail :img-alt="$t('common.map')" data-cy="showOnMap">
                  <template #icon>
                    <icon-pin/>
                  </template>
                  <template #text>
                    <router-link :to="`/${$route.params.locale}/institutions/${listType}/details/${actId}/map`">
                      {{ $t('details.showOnMap') }}
                    </router-link>
                  </template>
                </info-detail>
                <!-- Drive-To -->
                <info-detail :img-alt="$t('common.route')" v-if="institution.address" data-cy="driveToDestination">
                  <template #icon>
                    <icon-navigation/>
                  </template>
                  <template #text>
                    <a
                      :href="getGoogleMapsLink(institution.address.street, institution.address.place)"
                      target="_blank"
                    >
                      {{ $t('details.routeViaNavigationApp') }}
                    </a>
                  </template>
                </info-detail>
                <!-- Connection NAH.SH -->
                <nah-sh-link
                  v-if="hasNahShLink"
                  :start-pos="userPosition"
                  :end-pos="institution.position"
                  :end-name="institution.name"
                  data-cy="nahSH"
                />
              </div>
            </section>
            <hr class="mb-4">
            <!-- Contact -->
            <section id="contact" class="py-3" data-cy="contact">
              <h3 class="mb-3">{{ $t('common.contact') }}</h3>
              <div class="row m-0 p-0 justify-content-between">
                <!-- Address -->
                <info-detail v-if="institution.address" :img-alt="$t('details.address')">
                  <template #icon>
                    <icon-address/>
                  </template>
                  <template #text>
                    <div class="text-dark">
                      {{ institution.address.street }}<br>
                      {{ institution.address.zip }} {{ institution.address.place }}
                    </div>
                  </template>
                </info-detail>
                <!-- Website -->
                <info-detail
                  v-if="institution.website && institution.website.label"
                  :img-alt="$t('common.website')"
                >
                  <template #icon>
                    <icon-globe/>
                  </template>
                  <template #text>
                    <a :href="institution.website.identifier" target="_blank">
                      {{ institution.website.label }}
                    </a>
                  </template>
                </info-detail>
                <!-- E-Mail -->
                <info-detail v-if="institution.email" :img-alt="$t('common.email')">
                  <template #icon>
                    <icon-mail/>
                  </template>
                  <template #text>
                    <a :href="'mailto:' + institution.email">{{ institution.email }}</a>
                  </template>
                </info-detail>
                <!-- Telephone -->
                <info-detail v-if="institution.tel" :img-alt="$t('details.telephone')">
                  <template #icon>
                    <icon-phone/>
                  </template>
                  <template #text>
                    <a
                      :href="'tel:' + institution.tel"
                      v-if="institution.tel.length > 6 && institution.tel.length <= 16"
                    >
                      {{ institution.tel }}
                    </a>
                    <!-- fallback without link if no valid tel format -->
                    <span v-else>{{ institution.tel }}</span>
                  </template>
                </info-detail>
              </div>
            </section>
            <hr class="mb-4">
            <!-- MuseumsCard XS & SM -->
            <section
              id="museumscard"
              class="d-md-none"
              v-if="museumsCardEnabled && institution.tags && institution.tags.includes('MuseumsCard')"
            >
              <museums-card class="mt-5 mt-md-0"/>
              <hr class="mb-4 mt-5">
            </section>
            <!-- Event Calender -->
            <section
              id="event-calender"
              class="py-3"
              v-if="institution.eventCalender"
            >
              <h3>{{ $t('details.eventCalender') }}</h3>
              <b-container>
                <info-detail :img-alt="$t('details.eventCalender')" class="pt-3">
                  <template #icon>
                    <icon-calender/>
                  </template>
                  <template #text>
                    <a :href="institution.eventCalender.identifier" target="_blank">
                      {{ $t('details.showEvents') }}
                    </a>
                  </template>
                </info-detail>
              </b-container>
              <hr class="mb-4 mt-4">
            </section>
            <!-- Opening Times -->
            <section
              id="opening-times"
              class="py-3"
              data-cy="openingTimes"
            >
              <h3>{{ $t('details.openingHours') }}</h3>
              <p v-if="!institution.openingTimes">
                {{ $t('details.noOpeningHours') }}
              </p>
              <div v-else id="opening-hours-container">
                <!-- Opening Status -->
                <div v-if="institution.openingTimes.week" id="opening-status">
                  <b-row v-if="getCurrentState()">
                    <b-col cols="3">
                      <div id="opened" class="py-2 mt-4 mb-2">
                        {{ $t('details.currentlyOpened') }}
                      </div>
                    </b-col>
                    <b-col cols="4" id="nextOpened" class="pt-2 mt-4 mb-2">
                      <p>{{ $t('details.closes') }} {{ getNextClosingTime() | time($i18n.locale) }}</p>
                    </b-col>
                  </b-row>
                  <b-row v-else>
                    <b-col cols="3">
                      <div id="closed" class="py-2 mt-4 mb-2">
                        {{ $t('details.currentlyClosed') }}
                      </div>
                    </b-col>
                  </b-row>
                </div>
                <div id="opening-hours-list" v-if="institution.openingTimes.week">
                  <!-- Highlights the current day of the week -->
                  <div :class="{'opening-hours-row': true, 'opening-hours-row-active': compareDay(1)}">
                    <div class="opening-hours-day">
                      {{ $t('details.monday') }}
                    </div>
                    <div class="opening-hours-times">
                      <div v-if="institution.openingTimes.week.mon && institution.openingTimes.week.mon.first && institution.openingTimes.week.mon.first.timeStart && institution.openingTimes.week.mon.first.timeEnd">
                        <span>{{ institution.openingTimes.week.mon.first.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.mon.first.timeEnd | time($i18n.locale) }} </span>
                        <span v-if="institution.openingTimes.week.mon.second && institution.openingTimes.week.mon.second.timeStart && institution.openingTimes.week.mon.second.timeEnd">
                          <br>
                          {{ institution.openingTimes.week.mon.second.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.mon.second.timeEnd | time($i18n.locale) }} </span>
                      </div>
                      <span v-else class="opening-hours-closed-text">{{ $t('details.closed') }}</span>
                    </div>
                  </div>
                  <div :class="{'opening-hours-row': true, 'opening-hours-row-active': compareDay(2)}">
                    <div class="opening-hours-day">
                      {{ $t('details.tuesday') }}
                    </div>
                    <div class="opening-hours-times">
                      <div v-if="institution.openingTimes.week.tue && institution.openingTimes.week.tue.first && institution.openingTimes.week.tue.first.timeStart && institution.openingTimes.week.tue.first.timeEnd">
                        <span>{{ institution.openingTimes.week.tue.first.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.tue.first.timeEnd | time($i18n.locale) }} </span>
                        <span v-if="institution.openingTimes.week.tue.second && institution.openingTimes.week.tue.second.timeStart && institution.openingTimes.week.tue.second.timeEnd">
                          <br>
                          {{ institution.openingTimes.week.tue.second.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.tue.second.timeEnd | time($i18n.locale) }} </span>
                      </div>
                      <span v-else class="opening-hours-closed-text">{{ $t('details.closed') }}</span>
                    </div>
                  </div>
                  <div :class="{'opening-hours-row': true, 'opening-hours-row-active': compareDay(3)}">
                    <div class="opening-hours-day">
                      {{ $t('details.wednesday') }}
                    </div>
                    <div class="opening-hours-times">
                      <div v-if="institution.openingTimes.week.wen && institution.openingTimes.week.wen.first && institution.openingTimes.week.wen.first.timeStart && institution.openingTimes.week.wen.first.timeEnd">
                        <span>{{ institution.openingTimes.week.wen.first.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.wen.first.timeEnd | time($i18n.locale) }} </span>
                        <span v-if="institution.openingTimes.week.wen.second && institution.openingTimes.week.wen.second.timeStart && institution.openingTimes.week.wen.second.timeEnd">
                          <br>
                          {{ institution.openingTimes.week.wen.second.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.wen.second.timeEnd | time($i18n.locale) }} </span>
                      </div>
                      <span v-else class="opening-hours-closed-text">{{ $t('details.closed') }}</span>
                    </div>
                  </div>
                  <div :class="{'opening-hours-row': true, 'opening-hours-row-active': compareDay(4)}">
                    <div class="opening-hours-day">
                      {{ $t('details.thursday') }}
                    </div>
                    <div class="opening-hours-times">
                      <div v-if="institution.openingTimes.week.thu && institution.openingTimes.week.thu.first && institution.openingTimes.week.thu.first.timeStart && institution.openingTimes.week.thu.first.timeEnd">
                        <span>{{ institution.openingTimes.week.thu.first.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.thu.first.timeEnd | time($i18n.locale) }} </span>
                        <span v-if="institution.openingTimes.week.thu.second && institution.openingTimes.week.thu.second.timeStart && institution.openingTimes.week.thu.second.timeEnd">
                          <br>
                          {{ institution.openingTimes.week.thu.second.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.thu.second.timeEnd | time($i18n.locale) }} </span>
                      </div>
                      <span v-else class="opening-hours-closed-text">{{ $t('details.closed') }}</span>
                    </div>
                  </div>
                  <div :class="{'opening-hours-row': true, 'opening-hours-row-active': compareDay(5)}">
                    <div class="opening-hours-day">
                      {{ $t('details.friday') }}
                    </div>
                    <div class="opening-hours-times">
                      <div v-if="institution.openingTimes.week.fri && institution.openingTimes.week.fri.first && institution.openingTimes.week.fri.first.timeStart && institution.openingTimes.week.fri.first.timeEnd">
                        <span>{{ institution.openingTimes.week.fri.first.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.fri.first.timeEnd | time($i18n.locale) }} </span>
                        <span v-if="institution.openingTimes.week.fri.second && institution.openingTimes.week.fri.second.timeStart && institution.openingTimes.week.fri.second.timeEnd">
                          <br>
                          {{ institution.openingTimes.week.fri.second.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.fri.second.timeEnd | time($i18n.locale) }} </span>
                      </div>
                      <span v-else class="opening-hours-closed-text">{{ $t('details.closed') }}</span>
                    </div>
                  </div>
                  <div :class="{'opening-hours-row': true, 'opening-hours-row-active': compareDay(6)}">
                    <div class="opening-hours-day">
                      {{ $t('details.saturday') }}
                    </div>
                    <div class="opening-hours-times">
                      <div v-if="institution.openingTimes.week.sat && institution.openingTimes.week.sat.first && institution.openingTimes.week.sat.first.timeStart && institution.openingTimes.week.sat.first.timeEnd">
                        <span>{{ institution.openingTimes.week.sat.first.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.sat.first.timeEnd | time($i18n.locale) }} </span>
                        <span v-if="institution.openingTimes.week.sat.second && institution.openingTimes.week.sat.second.timeStart && institution.openingTimes.week.sat.second.timeEnd">
                          <br>
                          {{ institution.openingTimes.week.sat.second.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.sat.second.timeEnd | time($i18n.locale) }} </span>
                      </div>
                      <span v-else class="opening-hours-closed-text">{{ $t('details.closed') }}</span>
                    </div>
                  </div>
                  <div :class="{'opening-hours-row': true, 'opening-hours-row-active': compareDay(0)}">
                    <div class="opening-hours-day">
                      {{ $t('details.sunday') }}
                    </div>
                    <div class="opening-hours-times">
                      <div v-if="institution.openingTimes.week.sun && institution.openingTimes.week.sun.first && institution.openingTimes.week.sun.first.timeStart && institution.openingTimes.week.sun.first.timeEnd">
                        <span>{{ institution.openingTimes.week.sun.first.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.sun.first.timeEnd | time($i18n.locale) }} </span>
                        <span v-if="institution.openingTimes.week.sun.second && institution.openingTimes.week.sun.second.timeStart && institution.openingTimes.week.sun.second.timeEnd">
                          <br>
                          {{ institution.openingTimes.week.sun.second.timeStart | time($i18n.locale) }} {{ $t('details.until') }} {{ institution.openingTimes.week.sun.second.timeEnd | time($i18n.locale) }} </span>
                      </div>
                      <span v-else class="opening-hours-closed-text">{{ $t('details.closed') }}</span>
                    </div>
                  </div>
                </div>
                <!-- Calendar Text Banner -->
                <b-alert
                  show
                  variant="info"
                  class="info"
                  v-if="institution.closedHolidays"
                >
                  <p v-if="institution.closedHolidays">
                    {{ $t('details.closedHolidays') }}
                    <span v-for="(holiday, index) in institution.closedHolidays" :key="index">
                      {{ holiday }}<span v-if="index < institution.closedHolidays.length - 1">{{ $t('details.comma') }}</span>
                    </span>
                  </p>
                </b-alert>

                <b-alert
                  show
                  variant="info"
                  class="info"
                  v-if="institution.openingTimes.description"
                >
                  <p v-if="institution.openingTimes.description">
                    {{ institution.openingTimes.description }}
                  </p>
                </b-alert>

                <p class="info-text" v-if="institution.openingTimes.week">
                  {{ $t('details.noGuarantee') }}
                  <a v-b-modal.feedback-modal
                     href="#"
                  >{{ $t('details.feedbackWrongOpeningHoursHeadline') }}</a>
                </p>
                <!--Corona Warning Banner -->
                <!-- <b-alert
                  show
                  variant="warning"
                  class="warning"
                >
                  <b-row>
                    <b-col class="col-auto pr-0">
                      <icon-base width="20" height="20">
                        <icon-warning />
                      </icon-base>
                    </b-col>
                    <b-col>{{ $t('details.coronaWarningText') }}</b-col>
                  </b-row>
                </b-alert> -->
              </div>
            </section>
            <hr class="mb-4">
            <!-- Social Media -->
            <section
              id="social-media"
              v-if="hasSocial"
              class="pt-4"
            >
              <h3>{{ $t('details.socialMedia') }}</h3>
              <social-links
                :facebook="institution.facebook"
                :twitter="institution.twitter"
                :instagram="institution.instagram"
                :youtube="institution.youtube"
                :vimeo="institution.vimeo"
              />
              <hr class="mb-4 mt-5">
            </section>
            <!-- Digital Services -->
            <section
              id="digital-services"
              v-if="hasDigitalServices"
              class="pt-4"
            >
              <h3>{{ $t('details.digitalContents') }}</h3>
              <digital-services :institution="institution"/>
              <hr class="mb-4 mt-5">
            </section>
            <!-- Categories -->
            <section
              id="categories"
              v-if="institution.categories && institution.categories.length > 0"
              class="py-3"
            >
              <h3>{{ $t('common.categories') }}</h3>
              <div v-if="institution.categories" class="chip-container pt-2">
                <router-link
                  v-for="(category, index) in institution.categories"
                  :key="index"
                  class="chip"
                  :class="{ active: categories.indexOf(category) !== -1 }"
                  :to="`${chipRouteBase}?categories=${encodeURIComponent(category)}`"
                >
                  {{ category }}
                </router-link>
              </div>
            </section>
            <!-- Services -->
            <section
              id="services"
              v-if="institution.tags && institution.tags.length > 0"
              class="py-3"
            >
              <h3>{{ $t('common.tags') }}</h3>
              <div v-if="institution.tags" class="chip-container pt-2" data-cy="institutionTags">
                <router-link
                  v-for="(tag, index) in institution.tags"
                  :key="index"
                  class="chip"
                  :class="{ active: tags.indexOf(tag) !== -1 }"
                  :to="`${chipRouteBase}?tags=${encodeURIComponent(tag)}`"
                >
                  {{ tag }}
                </router-link>
              </div>
            </section>
            <hr class="mt-4 mb-2">
            <!-- Footer -->
            <section
              id="footer"
              class="w-100 m-0 pb-3 text-center"
            >
              <b-button
                variant="link"
                v-b-modal.feedback-modal
                class="footer-text px-2 text-decoration-none"
                data-cy="feedbackButton"
              >
                {{ $t("details.feedback") }}
              </b-button>
              <feedback-modal :institution-name="institution.name"/>
              <router-link :to="`/${$route.params.locale}/institutions/${listType}/details/${actId}/about`" class="footer-text px-2" data-cy="impressum">
                {{ $t("navbar.legalNotice") }}
              </router-link>
            </section>
          </b-container>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import SkeletonScreen from '@/components/details/SkeletonScreen.vue'
import SocialLinks from '@/components/details/SocialLinks.vue'
import DigitalServices from '@/components/details/DigitalServices.vue'
import NahShLink from '@/components/details/NahShLink.vue'
import KsHeader from '@/components/layout/Header.vue'
import InfoDetail from '@/components/details/InfoDetail.vue'
import KsCarousel from '@/components/details/Carousel.vue'
import NavigatorShare from '@/components/details/NavigatorShare.vue'
import FeedbackModal from '@/components/details/FeedbackModal.vue'
import MuseumsCard from '@/components/details/MuseumsCard.vue'
import Navigation from '@/mixins/navigation'
import ScrollPosition from '@/mixins/scrollposition'
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'
import detectRTC from 'detectrtc'
import { lt } from 'semver'
import IconCalender from '@/components/icons/IconCalender.vue'

export default {
  name: 'Details',
  data() {
    return {
      institution: {},
      loading: true,
      dataLocale: 'de',
      museumsCardEnabled: process.env.VUE_APP_MUSEUMSCARD === 'true',
      // TODO Change double data
      observedDay: new Date().getDay(),
      day: new Date().getDay(),
      // sunday = 0, monday = 1 ... saturday = 6
      currentTime: new Date().toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      openingTimeDay: {}
    }
  },
  props: {
    actId: {
      type: String,
      default: 'act007'
    },
    listType: {
      type: String,
      default: 'map'
    }
  },
  computed: {
    ...mapState('filters', ['tags', 'categories']),
    ...mapGetters({
      userPosition: 'userPosition/getPosition'
    }),
    sharingUrl() {
      let getUrl = window.location
      let baseUrl = getUrl.protocol + '//' + getUrl.host
      let aliasPath = `/${this.actId}`
      return baseUrl + aliasPath
    },
    sharingTitle() {
      return `${this.institution.name} im kulturfinder.sh`
    },
    hasSocial() {
      if (!this.institution) return false
      return !!(this.institution.facebook ||
        this.institution.twitter ||
        this.institution.instagram ||
        this.institution.youtube ||
        this.institution.vimeo)
    },
    hasDigitalServices() {
      if (!this.institution.apps && !this.institution.digitalServices) return false
      return !!(this.institution.apps.ios.length > 0 ||
        this.institution.apps.android.length > 0 ||
        this.institution.digitalServices.length > 0)
    },
    hasNahShLink() {
      return this.institution.position
    },
    detectRTC() {
      return detectRTC
    },
    isIOSWebAppWrongVersion() {
      // getUserMedia only works as iOS-PWA with iOS 13.4.1 and higher
      const iOS = !!window.navigator.userAgent.match(/iPad/i) ||
        !!window.navigator.userAgent.match(/iPhone/i)
      return iOS &&
        window.matchMedia('(display-mode: standalone)').matches &&
        lt(this.detectRTC.osVersion, '13.4.1')
    },
    livingImagesEnabled() {
      // eslint-disable-next-line no-mixed-operators
      return detectRTC.isWebRTCSupported && detectRTC.isMobileDevice || screen.width < 1000
    },
    chipRouteBase() {
      return this.listType === 'dashboard'
        ? `/${this.$route.params.locale}/institutions/map`
        : `/${this.$route.params.locale}/institutions/${this.listType}`
    }
  },
  methods: {
    onFavoriteClick: async function () {
      await this.$store.dispatch('institutions/updateIsFavorite', this.institution)
    },
    compareDay(day) {
      // (sunday = 0, monday = 1 ... saturday = 6)
      return new Date().getDay() === day
    },
    getDayTimes() {
      if (this.day === 1) {
        this.openingTimeDay = this.institution.openingTimes.week.mon
      } else if (this.day === 2) {
        this.openingTimeDay = this.institution.openingTimes.week.tue
      } else if (this.day === 3) {
        this.openingTimeDay = this.institution.openingTimes.week.wed
      } else if (this.day === 4) {
        this.openingTimeDay = this.institution.openingTimes.week.thu
      } else if (this.day === 5) {
        this.openingTimeDay = this.institution.openingTimes.week.fri
      } else if (this.day === 6) {
        this.openingTimeDay = this.institution.openingTimes.week.sat
      } else if (this.day === 0) {
        this.openingTimeDay = this.institution.openingTimes.week.sun
      }
    },
    // returns true if institution is opened and false if institution is closed
    getCurrentState() {
      const formattedTime = `T${this.currentTime}`
      const openingTimes = this.institution.openingTimes.week

      if (
        // Monday first
        this.observedDay === 1 &&
        openingTimes.mon && openingTimes.mon.first &&
        formattedTime > openingTimes.mon.first.timeStart &&
        formattedTime < openingTimes.mon.first.timeEnd
      ) {
        console.log('Mon first')
        return true
      } else if (
        // Monday second
        this.observedDay === 2 &&
        openingTimes.mon && openingTimes.mon.second &&
        formattedTime > openingTimes.mon.second.timeStart &&
        formattedTime < openingTimes.mon.second.timeEnd
      ) {
        console.log('Mon second')
        return true
      } else if (
        // Tuesday first
        this.observedDay === 2 &&
        openingTimes.tue && openingTimes.tue.first &&
        formattedTime > openingTimes.tue.first.timeStart &&
        formattedTime < openingTimes.tue.first.timeEnd
      ) {
        console.log('Tue first')
        return true
      } else if (
        // Tuesday second
        this.observedDay === 2 &&
        openingTimes.tue && openingTimes.tue.second &&
        formattedTime > openingTimes.tue.second.timeStart &&
        formattedTime < openingTimes.tue.second.timeEnd
      ) {
        console.log('Tue second')
        return true
      } else if (
        // Wednesday first
        this.observedDay === 3 &&
        openingTimes.wen && openingTimes.wen.first &&
        formattedTime > openingTimes.wen.first.timeStart &&
        formattedTime < openingTimes.wen.first.timeEnd
      ) {
        console.log('Wed first')
        return true
      } else if (
        // Wednesday second
        this.observedDay === 3 &&
        openingTimes.wen && openingTimes.wen.second &&
        formattedTime > openingTimes.wen.second.timeStart &&
        formattedTime < openingTimes.wen.second.timeEnd
      ) {
        console.log('Wed second')
        return true
      } else if (
        // Thursday first
        this.observedDay === 4 &&
        openingTimes.thu && openingTimes.thu.first &&
        formattedTime > openingTimes.thu.first.timeStart &&
        formattedTime < openingTimes.thu.first.timeEnd
      ) {
        console.log('Thu first')
        return true
      } else if (
        // Thursday second
        this.observedDay === 4 &&
        openingTimes.thu && openingTimes.thu.second &&
        formattedTime > openingTimes.thu.second.timeStart &&
        formattedTime < openingTimes.thu.second.timeEnd
      ) {
        console.log('Thu second')
        return true
      } else if (
        // Friday first
        this.observedDay === 5 &&
        openingTimes.fri && openingTimes.fri.first &&
        formattedTime > openingTimes.fri.first.timeStart &&
        formattedTime < openingTimes.fri.first.timeEnd
      ) {
        console.log('Fri first')
        return true
      } else if (
        // Friday second
        this.observedDay === 5 &&
        openingTimes.fri && openingTimes.fri.second &&
        formattedTime > openingTimes.fri.second.timeStart &&
        formattedTime < openingTimes.fri.second.timeEnd
      ) {
        console.log('Fri second')
        return true
      } else if (
        // Saturday first
        this.observedDay === 6 &&
        openingTimes.sat && openingTimes.sat.first &&
        formattedTime > openingTimes.sat.first.timeStart &&
        formattedTime < openingTimes.sat.first.timeEnd
      ) {
        console.log('Sat first')
        return true
      } else if (
        // Saturday second
        this.observedDay === 6 &&
        openingTimes.sat && openingTimes.sat.second &&
        formattedTime > openingTimes.sat.second.timeStart &&
        formattedTime < openingTimes.sat.second.timeEnd
      ) {
        console.log('Sat second')
        return true
      } else if (
        // Sunday first
        this.observedDay === 0 &&
        openingTimes.sun && openingTimes.sun.first &&
        formattedTime > openingTimes.sun.first.timeStart &&
        formattedTime < openingTimes.sun.first.timeEnd
      ) {
        console.log('Sun first')
        return true
      } else if (
        // Sunday second
        this.observedDay === 0 &&
        openingTimes.sun && openingTimes.sun.second &&
        formattedTime > openingTimes.sun.second.timeStart &&
        formattedTime < openingTimes.sun.second.timeEnd
      ) {
        console.log('Sun second')
        return true
      } else {
        console.log('Sadly Closed')
        return false
      }
    },
    // returns the closing time if the institution is opened
    getNextClosingTime() {
      const formattedTime = `T${this.currentTime}`
      const openingTimes = this.institution.openingTimes.week

      // institution is opened -> return time institution will close
      if (this.getCurrentState() === true) {
        console.log('Current State: ', this.getCurrentState())
        // Monday
        if (this.day === 1 && formattedTime < openingTimes.mon.first.timeEnd) {
          return openingTimes.mon.first.timeEnd
        } else if (this.day === 1 && formattedTime > openingTimes.mon.second.timeStart) {
          return openingTimes.tue.second.timeEnd
        // Tuesday
        } else if (this.day === 2 && formattedTime < openingTimes.tue.first.timeEnd) {
          return openingTimes.tue.first.timeEnd
        } else if (this.day === 2 && formattedTime > openingTimes.tue.second.timeStart) {
          return openingTimes.tue.second.timeEnd
        // Wednesday
        } else if (this.day === 3 && formattedTime < openingTimes.wed.first.timeEnd) {
          return openingTimes.wed.first.timeEnd
        } else if (this.day === 3 && formattedTime > openingTimes.wed.second.timeStart) {
          return openingTimes.wed.second.timeEnd
        // Thursday
        } else if (this.day === 4 && formattedTime < openingTimes.thu.first.timeEnd) {
          return openingTimes.thu.first.timeEnd
        } else if (this.day === 4 && formattedTime > openingTimes.thu.second.timeStart) {
          return openingTimes.thu.second.timeEnd
        // Friday
        } else if (this.day === 5 && formattedTime < openingTimes.fri.first.timeEnd) {
          return openingTimes.fri.first.timeEnd
        } else if (this.day === 5 && formattedTime > openingTimes.fri.second.timeStart) {
          return openingTimes.fri.second.timeEnd
        // Saturday
        } else if (this.day === 6 && formattedTime < openingTimes.sat.first.timeEnd) {
          return openingTimes.sat.first.timeEnd
        } else if (this.day === 6 && formattedTime > openingTimes.sat.second.timeStart) {
          return openingTimes.sat.second.timeEnd
        // Sunday
        } else if (this.day === 0 && formattedTime < openingTimes.sun.first.timeEnd) {
          return openingTimes.sun.first.timeEnd
        } else if (this.day === 0 && formattedTime > openingTimes.sun.second.timeStart) {
          return openingTimes.sun.second.timeEnd
        }
      }
    }
  },
  filters: {
    time(value, locale) {
      let time = moment('1970-01-01' + value).locale(locale).format('LT')
      if (locale === 'de') {
        time += ' Uhr'
      } else if (locale === 'da') {
        time = 'Kl. ' + time
      }
      return time
    }
  },
  mixins: [ScrollPosition, Navigation],
  components: {
    IconCalender,
    KsHeader,
    KsCarousel,
    SkeletonScreen,
    SocialLinks,
    DigitalServices,
    NahShLink,
    InfoDetail,
    NavigatorShare,
    FeedbackModal,
    MuseumsCard
  },
  async activated() {
    // check if same id previously opened and locale not changed
    if (this.institution &&
      this.institution.id === this.actId &&
      this.$i18n.locale === this.dataLocale) return

    // jump to top because it's a new id
    if (ScrollPosition && this.scrollposition) {
      this.resetScrollPosition()
    }

    // get details data from vuex store
    this.loading = true
    this.institution = {}
    this.$store.dispatch('institutions/fetchDetails', { id: this.actId })
      .then((institution, _) => {
        if (institution) this.institution = institution
        if (institution && institution.hasDetails === false) this.$bvModal.show('no-network-modal')
      })

    this.dataLocale = this.$i18n.locale
  },
  updated() {
    // check if banner available and wait until it has finished loading to remove skeleton screen
    if (!this.institution.name || !this.loading) return
    const banner = document.querySelector('.carousel-image.banner-0')
    if (banner && this.institution.images.length) {
      banner.onload = () => {
        this.loading = false
        if (this.$route.hash) setTimeout(() => { location.href = this.$route.hash }, 1)
      }
    } else {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
input[type=submit] {
  font-size: inherit;
}

#living-images-info{
  background-color: $gray;
}
#claim {
  font-size: 1.1rem;
  font-weight: 400;
  font-style: italic;
  color: $primary;
}

.text-padding{
  padding: 1.5em;
}

.living-images-button{
  border-radius: 0.5rem !important;
}
#li-button {
  border: 1px solid $primary;
  border-radius: 7px;
  min-width: 320px;
}
.li-image{
  width: 2.5rem;
  height: 100%;
}
.readonly {
  border-color: #869094;
  color: #869094;
}
#opening-hours-container{
  color: $dark !important;
}
#opening-status{
  font-size: 1.0rem;
  font-weight: 405;
  text-align: center;
  letter-spacing: 1px;
  margin-bottom: 13px;
}
#opened{
  background-color: rgba(151 247 151 / 0.5);
  border-radius: 0.5rem;
}
#closed{
  background-color: rgba(237 133 133 / 0.5);
  border-radius: 0.5rem;
}
#nextOpened{
  font-size: 0.9rem;
  font-weight: 300;
  text-align: left;
}
#opening-hours-list {
  margin-bottom: 1rem;
}

.opening-hours-row {
  display: flex;
  padding: 7px 10px;
}

.opening-hours-row-active {
  background-color: #d6e8fc;
  border-radius: 0.5rem;
}

.opening-hours-day {
  display: flex;
  flex-grow: 1;
  align-items: flex-start;
}

.opening-hours-closed-text {
  color: #576165;
}

.warning {
  font-size: 0.8rem;
}

.info {
  font-size: 1rem;
}

.info-text {
  font-size: 0.8rem;
  color: #576165;
}

.chip-container {
  display: flex;
  flex-flow: row wrap;
  margin: -4px;
}

.chip {
  border: 1px solid $primary;
  border-radius: 20px;
  display: flex;
  margin: 4px;
  padding: 7px 18px;
  text-decoration: none;
  cursor: pointer;
  color: $primary!important;
}

.chip:active,
.chip.active {
  background-color: var(--primary);
  border: 1px solid var(--primary);
  color: $white !important;
}

.btn:focus, .btn:hover {
  background-color: #fff !important;
  box-shadow: none;
  border: 1px solid #fff;
}
.btn:active {
  background-color: rgb(247, 247, 247) !important;
}
.footer-text{
  font-size: 0.8rem;
  color: #576165;
}

@media (max-width: $breakpoint-md) {
  #li-button {
    width: 100%;
  }
}
</style>
