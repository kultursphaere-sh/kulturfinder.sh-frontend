<template>
  <div
    id="no-gps-bar"
    class="py-2"
    v-b-modal.no-gps-modal
    data-cy="noGPSBar"
  >
    <div id="no-gps-bar-wrapper">
      <div id="no-gps-center-box">
        <icon-base
          :title="$t('common.distance')"
          color="#333333"
          class="mr-1 icon-20"
          role="img"
        >
          <icon-distance :aria-label="$t('common.distance')"/>
        </icon-base>
        <div id="no-gps-text" class="text-dark">
          {{ $t("noGPS.enableGPS") }}
        </div>
      </div>

      <b-button
        id="no-gps-close-button"
        pill
        class="mr-lg-2"
        @click="$emit('close')"
      >
        <icon-base
          :title="$t('common.close')"
          class="icon-18"
          role="img"
        >
          <icon-close :aria-label="$t('common.close')"/>
        </icon-base>
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoGpsBar'
}
</script>
<style lang="scss" scoped>
#no-gps-bar {
  width: 100%;
  background-color: $yellow;
  cursor: pointer;
}
#no-gps-bar-wrapper {
  position: relative;
  max-width: $breakpoint-lg;
  margin: auto;
}
#no-gps-close-button {
  background-color: $yellow;
  border: 0;
  position: absolute;
  padding: 4px;
  right: 0;
  margin-top: -26px;
  margin-right: 12px;
}
#no-gps-close-button:focus {
  background-color: $yellow !important;
}
#no-gps-close-button:hover,
#no-gps-close-button:active  {
  background-color: $yellow-dark !important;
}
#no-gps-center-box {
  display: flex;
  justify-content: center;
  text-align: center;
}
#no-gps-text {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
}
</style>
