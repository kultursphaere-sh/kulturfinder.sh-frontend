<template>
  <b-modal
    centered
    ok-only
    :ok-title="$t('common.gotIt')"
    id="no-network-modal"
    :title="$t('noNetwork.title')"
    ref="no-network-modal-ref"
  >
    <template>
      <b-container fluid>
        <b-row class="mt-3 px-3 text-left">
          <p class="my-auto">{{ $t('noNetwork.description') }}</p>
        </b-row>
      </b-container>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: 'NoNetworkModal',
  methods: {
    hideModal() {
      this.$refs['no-network-modal-ref'].hide()
    }
  }
}
</script>

<style lang="scss">
#no-network-modal .modal-body{
  padding: 0 !important;
  text-align: left !important;
}
#no-network-modal .modal-footer{
  border-top: 0;
}
</style>
