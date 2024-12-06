<template>
  <b-row class="info-detail flex-nowrap m-0 p-0 pr-sm-1 mb-3">
    <b-col class="col-auto p-0">
      <icon-base :title="imgAlt" role="img">
        <slot name="icon"/>
      </icon-base>
    </b-col>
    <b-col class="px-3 px-sm-2 px-lg-2">
      <slot name="text"/>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'InfoDetail',
  props: {
    imgAlt: {
      type: String,
      default: ''
    }
  }
}
</script>
