<template>
  <div id="details">
    <vue-headful
      :title="(institution.name ? institution.name : $t('common.loading')) + ' | ' + appName"
      :description="institution.claim + ' - ' + institution.description + ' || ' + appDescription"
      :keywords="appKeywords + ', '+ institution.tags + ', '+ institution.categories"
      :lang="`/${$route.params.locale}/`"
      og-locale="de"
      :url="appURL"
    />
    <ks-header>
      <template #center>
        <b-nav-item router-link :to="`/${$route.params.locale}/`">
          <img
            height="40px"
            class="logo p-0 img-light"
            :src="'/' + tenant + '/img/logos/kf_logo_light.png'"
            :alt="$t('navbar.logo')"
            role="img"
            data-cy="kulturfinderLogo"
          >
          <img
            height="40px"
            class="logo p-0 img-dark"
            :src="'/' + tenant + '/img/logos/kf_logo_dark.png'"
            :alt="$t('navbar.logo')"
            role="img"
            data-cy="kulturfinderLogo"
          >
        </b-nav-item>
      </template>
      <template class="d-flex" #right>
        <b-button variant="themed" pill class="labeled-button pr-0"
                  @click="onFavoriteClick"
        >
          <icon-base
            :title="$t('navbar.saveAsFavorite')"
            class="m-auto icon-18"
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
            <div class="headline" data-cy="institutionHeadline">
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
                    variant="transparent"
                    :to="`/${$route.params.locale}/institutions/${listType}/details/${actId}/living-images`"
                    :disabled="!livingImagesEnabled"
                  >
                    {{ $t('details.livingImagesCallToAction') }}
                    <icon-base :title="$t('dashboard.living-images')" class="li-image ml-2">
                      <icon-living-images/>
                    </icon-base>
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
                        <icon-base class="icon-20">
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
            <div id="primary-text">
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
                      <div>
                        <div v-if="institution.address.street">{{ institution.address.street }}<br></div>
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
            </div>
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
                  <b-row>
                    <b-col cols="12" md="4">
                      <!-- Institution currently opened -->
                      <div v-if="getCurrentOpeningState()" id="opened" class="py-2 mt-4 mb-2">
                        {{ $t('details.currentlyOpened') }}
                      </div>
                      <!-- Institution currently closed -->
                      <div v-if="!getCurrentOpeningState() && getNextOpeningDay() !== false" id="closed" class="py-2 mt-4 mb-2">
                        {{ $t('details.currentlyClosed') }}
                      </div>
                      <!-- Institution always closed -->
                      <div v-if="getNextOpeningDay() === false && !getCurrentOpeningState()" id="closed" class="py-2 mt-4 mb-2">
                        {{ $t('details.closed') }}
                      </div>
                    </b-col>
                    <b-col cols="12" md="4" id="nextOpened"
                           class="pt-2 mb-2 desktop-mt mobile-mt"
                    >
                      <!-- Institution currently opened -->
                      <p v-if="getCurrentOpeningState()">
                        {{ $t('details.closes') }} {{ $t('details.at') }} {{ getNextClosingTime() | time($i18n.locale) }}
                      </p>
                      <!-- Institution currently closed -->
                      <p v-if="!getCurrentOpeningState() && getNextOpeningDay() !== false">
                        {{ $t('details.opens') }} {{ $t(`details.${getNextOpeningDay()}`) }}
                        {{ $t('details.at') }} {{ getNextOpeningTime() | time($i18n.locale) }}
                      </p>
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

                <p class="info-text text-muted" v-if="institution.openingTimes.week">
                  {{ $t('details.noGuarantee') }}
                  <a v-b-modal.feedback-modal
                     href="#"
                  >{{ $t('details.feedbackWrongOpeningHoursHeadline') }}</a>
                </p>
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
              class="w-100 m-0 pb-3 text-center text-muted"
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

export default {
  name: 'Details',
  data() {
    return {
      institution: {},
      loading: true,
      dataLocale: 'de',
      museumsCardEnabled: process.env.VUE_APP_MUSEUMSCARD === 'true',
      day: new Date().getDay(),
      // sunday = 0, monday = 1 ... saturday = 6
      currentTime: new Date().toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  },
  props: {
    actId: {
      type: String,
      default: process.env.VUE_APP_NEW_API !== 'true' ? 'act007' : '0'
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
      const iOS = !!RegExp(/iPad/i).exec(window.navigator.userAgent) ||
        !!RegExp(/iPhone/i).exec(window.navigator.userAgent)
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
    },
    appURL: function () { return process.env.VUE_APP_URL },
    appName: function () { return process.env.VUE_APP_NAME },
    appDescription: function () { return process.env.VUE_APP_DESCRIPTION },
    appKeywords: function () { return process.env.VUE_APP_KEYWORDS },
    tenant: function () { return process.env.VUE_APP_TENANT }
  },
  methods: {
    onFavoriteClick: async function () {
      await this.$store.dispatch('institutions/updateIsFavorite', this.institution)
    },
    compareDay(day) {
      // (sunday = 0, monday = 1 ... saturday = 6)
      return new Date().getDay() === day
    },
    getDayTimes(day) {
      let openingTimeDay
      if (day === 1) {
        openingTimeDay = this.institution.openingTimes.week.mon
      } else if (day === 2) {
        openingTimeDay = this.institution.openingTimes.week.tue
      } else if (day === 3) {
        openingTimeDay = this.institution.openingTimes.week.wen
      } else if (day === 4) {
        openingTimeDay = this.institution.openingTimes.week.thu
      } else if (day === 5) {
        openingTimeDay = this.institution.openingTimes.week.fri
      } else if (day === 6) {
        openingTimeDay = this.institution.openingTimes.week.sat
      } else if (day === 0) {
        openingTimeDay = this.institution.openingTimes.week.sun
      }
      return openingTimeDay || null
    },

    getCurrentOpeningState() {
      const formattedTime = `T${this.currentTime}`
      const openingTimes = this.getDayTimes(new Date().getDay())

      if (
        openingTimes && openingTimes.first &&
        formattedTime > openingTimes.first.timeStart &&
        formattedTime < openingTimes.first.timeEnd
      ) {
        return true
      } else {
        return !!(openingTimes && openingTimes.second &&
          formattedTime > openingTimes.second.timeStart &&
          formattedTime < openingTimes.second.timeEnd)
      }
    },

    getNextClosingTime() {
      const formattedTime = `T${this.currentTime}`
      const openingTimes = this.getDayTimes(new Date().getDay())
      let closingTime

      if (formattedTime < openingTimes.first.timeEnd) {
        closingTime = openingTimes.first.timeEnd
      } else if (formattedTime > openingTimes.second.timeStart) {
        closingTime = openingTimes.second.timeEnd
      }
      return closingTime
    },

    // returns true if day has openingTimes
    getOpenDayState(day) {
      const openingTimes = this.getDayTimes(day)

      if (
        openingTimes &&
        openingTimes.first &&
        openingTimes.first.timeStart === '' &&
        openingTimes.first.timeEnd === '' &&
        openingTimes.second &&
        openingTimes.second.timeStart === '' &&
        openingTimes.second.timeEnd === ''
      ) {
        return false
      }

      return !(openingTimes === undefined || openingTimes === null)
    },

    getNextOpeningTime() {
      const formattedCurrentTime = `T${this.currentTime}`
      let openingTimes = this.getDayTimes(new Date().getDay())
      const nextDay = this.day + 1

      // institution is closed but will open the same day
      if (openingTimes && formattedCurrentTime < openingTimes.first.timeStart) {
        return openingTimes.first.timeStart
      }

      // institution is closed, has been open that day and will open again the same day
      if (openingTimes && openingTimes.second &&
          formattedCurrentTime < openingTimes.second.timeStart &&
          formattedCurrentTime > openingTimes.first.timeEnd) {
        return openingTimes.second.timeStart
      }

      // institution is closed and won't open the same day
      // find next day with opening times
      for (let i = nextDay; i !== this.day; i++) {
        if (i === 7) {
          // sunday
          i = 0
        }
        if (this.getOpenDayState(i) === true && this.getCurrentOpeningState() === false) {
          return this.getDayTimes(i).first.timeStart
        }
      } return openingTimes.first.timeStart
    },

    getNextOpeningDay() {
      const formattedCurrentTime = `T${this.currentTime}`
      let openingTimes = this.getDayTimes(new Date().getDay())
      let openingDayNum = new Date().getDay()
      const nextDay = this.day + 1

      // institution is closed but will open the same day
      if (openingTimes && formattedCurrentTime < openingTimes.first.timeStart) {
        return this.getDayName(openingDayNum)
      }

      // institution is closed, has been open that day and will open again the same day
      if (openingTimes && openingTimes.second &&
        formattedCurrentTime < openingTimes.second.timeStart &&
        formattedCurrentTime > openingTimes.first.timeEnd) {
        return this.getDayName(openingDayNum)
      }

      for (let i = nextDay; i !== this.day; i++) {
        if (i === 7) {
          // sunday
          i = 0
        }
        if (this.getOpenDayState(i) === true && this.getCurrentOpeningState() === false) {
          return this.getDayName(i)
        }
      } return false
    },

    getDayName(dayIndex) {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      return days[dayIndex]
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
.logo {
  @media (max-width: $breakpoint-logo-xs) {
    width: 120px;
    height: auto;
  }
  @media (min-width: $breakpoint-logo-xs) {
    width: auto;
    height: 40px;
  }
}

input[type=submit] {
  font-size: inherit;
}

#living-images-info{
  background-color: var(--body-bg);
}
#claim {
  font-size: 1.1rem;
  font-weight: 400;
  font-style: italic;
  color: var(--primary);
}

.text-padding{
  padding: 1.5em;
}

#li-button {
  border: 1px solid var(--primary);
  border-radius: 7px;
  min-width: 320px;
  color: var(--body-color);

  .icon {
    color: var(--primary);
  }
}

#li-button:hover, #li-button:focus, #li-button:active {
  background-color: var(--light);
}

.li-image{
  width: 2.5rem;
  height: 100%;
}

#primary-text {
  color: var(--primary);
}

.readonly {
  border-color: var(--muted);
  color: var(--muted);
}
#opening-hours-container{
  color: var(--body-color);
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
  background-color: rgba(#d6e8fc, 0.8);
  color: $dark;
  border-radius: 0.5rem;
}

.opening-hours-day {
  display: flex;
  flex-grow: 1;
  align-items: flex-start;
}

.opening-hours-closed-text {
  color: var(--muted) !important;
}

.warning {
  font-size: 0.8rem;
}

.info {
  font-size: 1rem;
}

.info-text {
  font-size: 0.8rem;
}

.chip-container {
  display: flex;
  flex-flow: row wrap;
  margin: -4px;
}

.chip {
  border: 1px solid var(--primary);
  border-radius: 20px;
  display: flex;
  margin: 4px;
  padding: 7px 18px;
  text-decoration: none;
  cursor: pointer;
  color: var(--primary)!important;
}

.chip:active,
.chip.active {
  background-color: var(--primary);
  border: 1px solid var(--primary);
  color: $white !important;
}

.footer-text{
  font-size: 0.8rem;
  color: var(--muted);
}

@media (max-width: $breakpoint-md) {
  #li-button {
    width: 100%;
  }
}

@media (min-width: 500px) { /* Für Desktop */
  .desktop-mt {
    margin-top: 25px;
  }
}

@media (max-width: 767px) { /* Für Mobilgeräte */
  .mobile-mt {
    margin-top: 5px;
    margin-left: 5px;
  }
}

</style>
