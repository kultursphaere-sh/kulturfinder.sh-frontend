<template>
  <b-modal
    centered
    :ok-title="geolocationDenied
      ? $t('common.gotIt')
      : $t('noGPS.enableGPS')"
    :cancel-title="$t('common.close')"
    @ok="handleOk"
    :ok-only="geolocationDenied"
    @show="setGeolocationPermissionStatus"
    id="no-gps-modal"
    :title="$t('navbar.noGPS')"
    ref="no-gps-modal-ref"
    scrollable
  >
    <template v-slot:modal-header class="gps-info">
      <b-row class="gps-info w-100 pt-0 d-flex pl-3 mt-0">
        <icon-base height="48" width="48">
          <icon-distance :aria-label="$t('common.distance')"/>
        </icon-base>
        <div class="col-10">
          <h3>{{ $t('noGPS.title') }}</h3>
          <span class="">{{ $t('noGPS.description') }}</span>
        </div>
        <b-button
          variant="link"
          id="header-close-button"
          pill
          @click="hideModal"
        >
          <icon-base
            :title="$t('common.close')"
            width="22"
            height="22"
            role="img"
          >
            <icon-close :aria-label="$t('common.close')"/>
          </icon-base>
        </b-button>
      </b-row>
    </template>
    <template>
      <b-container fluid>
        <b-row class="mt-3 px-3">
          <p id="no-gps-benefits" class="my-auto">{{ $t('noGPS.yourBenefits') }}</p>
        </b-row>
        <b-row class="py-2">
          <icon-base
            height="48"
            width="48"
            class="ml-3"
            color="#509500"
          >
            <icon-distance :aria-label="$t('common.distance')"/>
          </icon-base>
          <span class="benefit-text col-8 my-auto">
            {{ $t('noGPS.benefit1') }}
          </span>
        </b-row>
        <b-row class="mb-3 py-2">
          <icon-base
            height="48"
            width="48"
            class="ml-3"
            color="#509500"
          >
            <icon-distance :aria-label="$t('common.distance')"/>
          </icon-base>
          <span class="benefit-text col-8 my-auto">
            {{ $t('noGPS.benefit2') }}
          </span>
        </b-row>
        <b-row class="how-to-container px-2" v-if="geolocationDenied">
          <!-- geolocationDenied -->
          <div class="how-to-box w-100 bg-light rounded p-3 d-flex align-content-around flex-column">
            <b-row class="mb-3">
              <span id="no-gps-handle" class="col-12 mb-2">{{ $t('noGPS.howToHandle') }}</span>
              <span id="no-gps-handle-2" class="col-12">{{ $t('noGPS.howToHandle2') }}</span>
            </b-row>
          </div>
        </b-row>
      </b-container>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: 'NoGpsModal',
  data() {
    return {
      geolocationDenied: false
    }
  },
  methods: {
    hideModal() {
      this.$refs['no-gps-modal-ref'].hide()
    },
    handleOk() {
      this.$vuexGeolocation.watchPosition()
    },
    async setGeolocationPermissionStatus() {
      const { state } = await navigator.permissions.query({ name: 'geolocation' })
      this.geolocationDenied = state === 'denied'
    }
  }
}
</script>

<style lang="scss">
#no-gps-modal .gps-info{
  border-bottom:0;
  background-color: $yellow !important;
}
#no-gps-modal .modal-header {
  background-color: $yellow !important;
  position: relative;
}
#header-close-button{
  position: absolute;
  right: 10px;
}
#no-gps-modal .modal-body{
  padding: 0 !important;
  text-align: left !important;
}
#no-gps-modal .modal-footer{
  border-top: 0;
}
.benefit-text {
  font-weight: 500;
}
#no-gps-handle,#no-gps-handle-2{
  font-size: 0.8rem;
}
#no-gps-handle{
  font-weight: 500;
}
#no-gps-benefits{
  font-size: 0.8rem;
}
</style>
