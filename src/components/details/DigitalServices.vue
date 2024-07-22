<template>
  <b-row class="digital-services px-2">
    <template v-if="institution.apps.android" class="d-flex">
      <a
        v-for="app in institution.apps.android"
        :key="app.identifier"
        :href="app.identifier"
        target="_blank"
      >
        <b-col class="digital-service my-2">
          <img alt="Android app logo" src="@/assets/images/icons/digital-services/android-app.png">
          <p>{{ app.label }}</p>
        </b-col>
      </a>
    </template>
    <template v-if="institution.apps.ios">
      <a
        v-for="app in institution.apps.ios"
        :key="app.identifier"
        :href="app.identifier"
        target="_blank"
      >
        <b-col class="digital-service my-2">
          <img alt="iOS app logo" src="@/assets/images/icons/digital-services/ios-app.png">
          <p>{{ app.label }}</p>
        </b-col>
      </a>
    </template>
    <template v-if="institution.digitalServices">
      <a
        v-for="(service, key) in institution.digitalServices"
        :key="key"
        :href="service.identifier"
        target="_blank"
      >
        <b-col class="digital-service my-2" v-if="service.label && service.icon">
          <icon-base
            :title="`${$t('details.digitalContent')}: ${service.label}`"
            class="icon-40"
            role="img"
          >
            <component :is="`icon-${service.icon}`"/>
          </icon-base>
          <p>{{ service.label }}</p>
        </b-col>
      </a>
    </template>
  </b-row>
</template>

<script>
export default {
  name: 'DigitalServices',
  props: {
    institution: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped>
.digital-service p {
  margin-top: 1vh;
  font-size: 1rem;
  text-align: center;
}
.icon-40 {
  height: 40px;
  width: 40px;
}
div {
  text-align: center;
}
img {
  max-height: 40px;
  max-width: 40px;
  margin: auto;
}
p {
  margin-bottom: 0;
}
</style>
