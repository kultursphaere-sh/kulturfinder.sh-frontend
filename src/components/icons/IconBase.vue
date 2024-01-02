<template>
  <svg
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :aria-label="title"
    viewBox="0 0 24 24"
    role="presentation"
  >
    <title>{{ title }}</title>
    <g
      v-if="color"
      :fill="color"
    >
      <slot/>
    </g>
    <slot v-if="!color"/>
  </svg>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    title: {
      type: String,
      default: 'icon'
    },
    width: {
      type: [Number, String],
      default: 24
    },
    height: {
      type: [Number, String],
      default: 24
    },
    color: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
svg {
  display: inline-block;
}
</style>
