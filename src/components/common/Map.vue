<template>
  <div class="map">
    <vue-headful
      :title="$t('common.map') + ' | ' + $t('SEO.title')"
      :description="$t('SEO.description')"
      :keywords="$t('SEO.commonKeywords')"
      :lang="`/${$route.params.locale}/`"
      og-locale="de"
      url="https://kulturfinder.sh"
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
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
@import "~leaflet/dist/leaflet.css";
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

.map {
  height:100%;
}
.info-window-header {
  display: flex;
  flex: 0 0 100%;
  height: 50%;
  align-items: center;
  /* padding-top: 2vh; */
  /* padding-left: 3vw; */
  padding-left: 16px;
  background-color: $primary;
}
.info-window {
  font-family: "Roboto", sans-serif;
  // height: 94px;
  /* height: 18vh;
  width: 63vw; */
  display: flex;
  flex-wrap: wrap;
  text-decoration: none;
}
.info-window-header {
  display: flex;
  flex: 0 0 100%;
  height: 50%;
  align-items: center;
  /* padding-top: 2vh; */
  /* padding-left: 3vw; */
  padding-left: 16px;
  background-color: $primary;
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
  background-color: #f6f6f6 !important;
}
.drive-to {
  // height: 100%;
  /* width: 8vh; */
  width: 47px;
  background-color: $info;
  // padding-top: 0.1rem;
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
  background-color: #f6f6f6;
  align-items: center;
}

.claim-info:hover {
  text-decoration: none;
}

.claim-info span {
  font-size: 13px;
  letter-spacing: -0.3px;
  color: #667074;
}

.link-to {
  height: 100%;
  /* width: 10vw; */
  padding-right: 11px;
  background-color: #f6f6f6;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style lang="scss">
@import "@/styles/variables.scss";

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
  background-color: #f6f6f6;
}

.leaflet-popup-content {
  margin: 0;
}

.leaflet-popup-close-button {
  display: none;
}

.leaflet-popup-tip {
  background-color: #f6f6f6 !important;
}

.cluster-marker {
  display: flex;
  justify-content: center; /* align horizontal */
  align-items: center; /* align vertical */
  background-color: #ffffff;
  border-radius: 50%;
  text-align: center;
  border-color: #243F6E;
  border-style: solid;
  border-width: 2px;
  font-weight: bold;
}

.leaflet-control-locate.active {
    color: #1c3f6e !important; /* has to be css*/
}

/* prevent bad mobile styling */
.leaflet-touch .leaflet-bar, .leaflet-touch .leaflet-control-attribution, .leaflet-touch .leaflet-control-layers {
  box-shadow: rgba(0, 0, 0, 0.4) 0px 1px 5px;
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
