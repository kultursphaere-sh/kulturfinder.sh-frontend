<template>
  <v-map
    ref="lmap"
    id="map"
    :zoom="zoom"
    :center="center"
    :options="{ zoomControl: false, worldCopyJump:true //worldCopyJump is used to let the location points jump to the next tile if a user starts scrolling to another map tile
    }"
    :data-is-high-contrast="isHighContrast"
    data-cy="map"
  >
    <v-controllayer position="topright"/>
    <v-tilelayer
      v-for="tileProvider in tileProviders"
      :key="tileProvider.name"
      :name="tileProvider.name"
      :visible="tileProvider.visible"
      :url="tileProvider.url"
      :attribution="tileProvider.attribution"
      layer-type="base"
    />
    <v-locatecontrol
      :options="{
        position: 'bottomright',
        flyTo: true,
        showCompass: false,
        cacheLocation: true,
        icon: 'fa fa-compass',
        showPopup: false,
        clickBehavior: {
          inView: 'setView',
          outOfView: 'setView',
          inViewNotFollowing: 'inView'
        },
        strings: { title: 'Eigene Position' }
      }"
    />
    <v-control-zoom position="bottomright"/>
    <v-marker-cluster
      :options="{
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: true,
        maxClusterRadius: 41, //in pixel, default is 80, 41 is max size of marker icon
        iconCreateFunction: function(cluster) {
          return getClusterIcon(cluster)
        }
      }"
    >
      <v-marker
        v-for="currentInstitution in institutions"
        :key="currentInstitution.id"
        :lat-lng="currentInstitution.position"
        :icon="icon"
      >
        <v-popup
          :options="{
            offset: popupAnchor
          }"
        >
          <div class="info-window">
            <div class="info-window-header">
              <router-link :to="`/${$route.params.locale}/institutions/map/details/${currentInstitution.name}`" class="label py-3">
                <span>{{ currentInstitution.name }}</span>
              </router-link>
              <a @click="closePopup" class="text-white">
                <icon-base
                  title="Schließen"
                  class="info-window-close"
                >
                  <icon-close/>
                </icon-base>
              </a>
            </div>
            <div class="info-window-footer bg-light">
              <a
                class="drive-to pb-2 pt-1 d-flex justify-content-center flex-column text-white"
                :href="getGoogleMapsLink(currentInstitution.street, currentInstitution.place)"
                target="_blank"
              >
                <icon-base title="Anfahrt" class="mx-auto icon-18">
                  <icon-navigation/>
                </icon-base>
                <span>{{ $t("common.route") }}</span>
              </a>
              <router-link :to="`/${$route.params.locale}/institutions/map/details/${currentInstitution.name}`" class="claim-info">
                <span v-if="currentInstitution.teaser" class="py-2 px-2 flex-fill">{{ currentInstitution.teaser }}</span>
              </router-link>
              <router-link :to="`/${$route.params.locale}/institutions/map/details/${currentInstitution.name}`" class="link-to my-auto">
                <icon-base title="Zur Detailseite">
                  <icon-arrow-right/>
                </icon-base>
              </router-link>
            </div>
          </div>
        </v-popup>
      </v-marker>
    </v-marker-cluster>
  </v-map>
</template>

<script>
import { LControlLayers, LControlZoom, LMap, LMarker, LPopup, LTileLayer } from 'vue2-leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import Navigation from '@/mixins/navigation'
import Vue2LeafletLocatecontrol from 'vue2-leaflet-locatecontrol/Vue2LeafletLocatecontrol'

export default {
  name: 'MapRender',
  components: {
    'v-map': LMap,
    'v-tilelayer': LTileLayer,
    'v-marker': LMarker,
    'v-popup': LPopup,
    'v-controllayer': LControlLayers,
    'v-marker-cluster': Vue2LeafletMarkerCluster,
    'v-locatecontrol': Vue2LeafletLocatecontrol,
    'v-control-zoom': LControlZoom
  },
  mixins: [Navigation],
  data() {
    return {
      center:
        process.env.VUE_APP_TENANT === 'hb'
          ? {
            lat: 53.315317,
            lng: 8.667360
          }
          : {
            lat: 54.219367,
            lng: 9.696117 // 54.219367, 9.696117 is the center of Schleswig-Holstein
          },
      zoom: process.env.VUE_APP_TENANT === 'hb' ? 9 : 7,
      boundsMap: [
        [54.86228799417661, 11.501708984375002],
        [53.226123744371364, 7.8001464843750004]
      ],
      infoWindow: {
        open: false,
        position: {
          lat: 0,
          lng: 0
        },
        institution: {
          id: '',
          name: '',
          claim: ''
        },
        options: {
          pixelOffset: {
            width: 0,
            height: -45
          }
        }
      },
      popupAnchor: window.L.point(1, -5),
      icon: window.L.icon({
        iconUrl: '/' + process.env.VUE_APP_TENANT + '/img/single-location.svg',
        iconSize: [23, 33],
        iconAnchor: [11, 33]
      }),
      isHighContrast: false
    }
  },
  props: {
    'institutions': {
      type: Array,
      default: () => []
    }
  },
  computed: {
    tileProviders() {
      return [
        {
          name: 'CARTO',
          visible: true,
          attribution: '&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a target="_blank" href="https://carto.com/attributions">CARTO</a>',
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        },
        {
          name: 'OSM',
          visible: false,
          attribution: '\'&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        },
        {
          name: this.$t('map.highContrast'),
          visible: false,
          url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
          attribution: '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a target="_blank" href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a target="_blank" href="https://stamen.com">Stamen Design</a>'
        }
      ]
    }
  },
  methods: {
    closePopup() {
      this.$refs.lmap.mapObject.closePopup()
    },
    getClusterIcon(cluster) {
      return window.L.divIcon({
        className: 'cluster-marker',
        iconAnchor: [15, 15],
        iconSize: [30, 30],
        html: cluster.getChildCount()
      })
    },
    moveToBounds(institutions) {
      let boundsArray = []

      institutions.forEach(institution => {
        boundsArray.push([institution.position.lat, institution.position.lng])
      })

      if (boundsArray.length === 0) {
        boundsArray = this.boundsMap
      }

      let bounds = window.L.latLngBounds(boundsArray)
      const options = { maxZoom: 10, paddingTopLeft: [20, 40], paddingBottomRight: [50, 0] }

      this.$refs.lmap.mapObject.stop()

      setTimeout(() => {
        this.$refs.lmap.mapObject.flyToBounds(bounds, options)
      }, 1)
    }
  },
  watch: {
    institutions(institutionsNew, institutionsOld) {
      if (institutionsNew.length === institutionsOld.length &&
              institutionsNew.every((str) => institutionsOld.includes(str)) &&
              institutionsOld.every((str) => institutionsNew.includes(str))) {
        return
      }
      this.moveToBounds(institutionsNew)
    }
  },
  mounted() {
    // add _blank to leaflet attribution
    if (this.$refs.lmap) {
      this.$refs.lmap.mapObject.attributionControl.setPrefix('<a href="https://leafletjs.com" title="A JS library for interactive maps" target="_blank">Leaflet</a>')
      this.$refs.lmap.mapObject.addEventListener('baselayerchange', ({ name }) => {
        this.isHighContrast = name === this.$t('map.highContrast')
      })
    }
  },
  activated() {
    this.$refs.lmap.mapObject.invalidateSize()
    console.log(LMap)
  }
}
</script>

<style lang="scss" scoped>
.map {
  height:100%;
}
.info-window-header {
  display: flex;
  flex: 0 0 100%;
  height: 50%;
  align-items: center;
  padding-left: 16px;
  background-color: var(--primary);
}
.info-window {
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-wrap: wrap;
  text-decoration: none;
}
.info-window-header {
  display: flex;
  flex: 0 0 100%;
  height: 50%;
  align-items: center;
  padding-left: 16px;
  background-color: var(--primary);
}
.info-window-header .label {
  flex-grow: 1;
  font-size: 1rem;
  font-weight: 400;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: -0.3px;
  color: white !important;
}
.info-window-header .label:hover {
  text-decoration: none;
  color: white !important;
}
.info-window-close {
  justify-content: flex-end;
  cursor: pointer;
  margin: 11px;
  width: 16px;
  height: 24px;
}
.info-window-footer {
  height: 50%;
  width: 100%;
  display: flex;
}
.leaflet-popup-tip {
  background-color: var(--light) !important;
}
.drive-to {
  width: 47px;
  background-color: $info;
}

.drive-to:hover {
  text-decoration: none;
}

.drive-to span {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
}

.link-to, .claim-info {
  color: var(--muted);
}

.claim-info {
  display: flex;
  flex: 1;
  align-items: center;
}

.claim-info:hover {
  text-decoration: none;
}

.claim-info span {
  font-size: 13px;
  letter-spacing: -0.3px;
}

.link-to {
  height: 100%;
  padding-right: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.link-to svg {
  height: 24px;
  width: 14px;
}
</style>

<style scoped>
  @import "~leaflet/dist/leaflet.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
  @import "~leaflet/dist/leaflet.css";
  @import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
</style>

<style lang="scss">
#map {
  z-index: 0;

  &[data-is-high-contrast="true"] {
    .leaflet-marker-icon,
    .cluster-marker {
      filter: saturate(10);
    }
  }
}

/* bug fix */
.vue-map {
  height: 100% !important;
}

.leaflet-popup {
  margin-bottom: 40px;
}

.leaflet-popup-content-wrapper {
  overflow: hidden;
  padding: 0;
  background-color: var(--body-bg);
}

.leaflet-popup-content {
  margin: 0;
}

.leaflet-popup-close-button {
  display: none;
}

.leaflet-popup-tip {
  background-color: var(--light) !important;
}

.cluster-marker {
  display: flex;
  justify-content: center; /* align horizontal */
  align-items: center; /* align vertical */
  background-color: var(--light);
  border-radius: 50%;
  text-align: center;
  border-color: var(--primary);
  color: var(--primary);
  border-style: solid;
  border-width: 2px;
  font-weight: bold;
}

.leaflet-control-locate.active {
    color: var(--primary) !important; /* has to be css*/
}

/* prevent bad mobile styling */
.leaflet-touch .leaflet-bar, .leaflet-touch .leaflet-control-attribution, .leaflet-touch .leaflet-control-layers {
  box-shadow: rgba(0, 0, 0, 0.4) 0 1px 5px;
  border: none;
}

/* UI styling */
.leaflet-control-layers-toggle {
  width: 40px !important;
  height: 40px !important;
}
.leaflet-control-zoom * {
  width: 40px !important;
  height: 40px !important;
  line-height: 40px !important;
  font-size: 1.4rem !important;
}
.leaflet-control-zoom {
  border-radius: 7px !important;
}
.leaflet-bar a:first-child {
  border-top-left-radius: 7px !important;
  border-top-right-radius: 7px !important;
}
.leaflet-bar a:nth-child(2) {
  border-bottom-left-radius: 7px !important;
  border-bottom-right-radius: 7px !important;
}
.leaflet-control-locate {
  border-radius: 7px !important;
}
.leaflet-control-locate .leaflet-bar-part-single {
  width: 40px !important;
  height: 40px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 7px !important;
}
</style>
