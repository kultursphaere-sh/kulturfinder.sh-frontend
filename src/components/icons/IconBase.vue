<template>
  <svg
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
    :aria-label="title"
    viewBox="0 0 24 24"
    role="presentation"
    fill="currentColor"
  >
    <title>{{ title }}</title>
    <slot/>
  </svg>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    title: {
      type: String,
      default: 'icon'
    }
  }
}
</script>

<style scoped>
svg {
  display: inline-block;
}
</style>
