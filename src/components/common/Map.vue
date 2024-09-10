<template>
  <div class="map">
    <vue-headful
      :title="$t('common.map') + ' | ' + appName"
      :description="appDescription"
      :keywords="appKeywords"
      :lang="`/${$route.params.locale}/`"
      og-locale="de"
      :url="appURL"
    />
    <map-render :institutions="institutions"/>
  </div>
</template>

<script>
import MapSkeleton from '@/components/common/MapSkeleton.vue'

const MapRender = () => ({
  // The component to load (should be a Promise)
  component: import(/* webpackChunkName: "MapRender" */ '@/components/common/MapRender'),
  // A component to use while the async component is loading
  loading: MapSkeleton,
  // A component to use if the load fails
  error: MapSkeleton,
  // Delay before showing the loading component. Default: 200ms.
  delay: 0,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 10000
})
export default {
  name: 'Map',
  components: {
    MapRender
  },
  props: {
    'institutions': {
      type: Array,
      default: () => []
    }
  },
  computed: {
    appURL: function () { return process.env.VUE_APP_URL },
    appName: function () { return process.env.VUE_APP_NAME },
    appDescription: function () { return process.env.VUE_APP_DESCRIPTION },
    appKeywords: function () { return process.env.VUE_APP_KEYWORDS },
    tenant: function () { return process.env.VUE_APP_TENANT }
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
  color: white;
}

.claim-info {
  display: flex;
  flex: 1;
  background-color: var(--body-bg);
  align-items: center;
}

.claim-info:hover {
  text-decoration: none;
}

.claim-info span {
  font-size: 13px;
  letter-spacing: -0.3px;
  color: var(--muted);
}

.link-to {
  height: 100%;
  padding-right: 11px;
  background-color: var(--body-bg);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style scoped>
  @import "~leaflet/dist/leaflet.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
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

.leaflet-control-locate.active {
    color: var(--primary) !important; /* has to be css*/
}

/* prevent bad mobile styling */
.leaflet-touch .leaflet-bar, .leaflet-touch .leaflet-control-attribution, .leaflet-touch .leaflet-control-layers {
  box-shadow: rgba(0, 0, 0, 0.4) 0 1px 5px;
  border: none;
}

.leaflet-control-attribution {
  background-color: var(--light) !important;
  color: var(--body-color) !important;
}

.leaflet-control-attribution a {
  color: var(--primary) !important;
}

/* UI styling */
.leaflet-control-layers-toggle {
  width: 40px !important;
  height: 40px !important;
  background-color: var(--light);
  border-radius: 6px;
}

.leaflet-control-layers-expanded {
  background-color: var(--light) !important;
  color: var(--body-color) !important;
}

.leaflet-control-zoom * {
  width: 40px !important;
  height: 40px !important;
  line-height: 40px !important;
  font-size: 1.4rem !important;
  background-color: var(--light) !important;
  color: var(--body-color) !important;
}

.leaflet-control-zoom *:hover,
.leaflet-control-zoom *:focus  {
  background-color: var(--body-bg) !important;
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
  background-color: var(--light) !important;
  color: var(--body-color) !important;
}

.leaflet-control-locate .leaflet-bar-part-single:hover,
.leaflet-control-locate .leaflet-bar-part-single:focus {
  background-color: var(--body-bg) !important;
}
</style>
