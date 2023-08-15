<template>
  <b-alert
    class="museumscard-card"
    variant="success"
    show
  >
    <b-row>
      <b-col cols="8">
        <strong>{{ $t('details.museumscard.title') }}</strong><br>
        {{ $t('details.museumscard.text1') }}<br>
        {{ $t('details.museumscard.text2') }}<br>
      </b-col>
      <img
        src="@/assets/images/logos/museumscard_logo_2023_rotbeige.svg"
        height="103px"
        class="museumscard-logo alert-success"
        alt="Museumscard"
        data-cy="MuseumsCardLogo"
      >
    </b-row>
    <b-row>
      <b-col>
        <a href="https://www.meine-museumscard.de" target="_blank">
          {{ $t('details.museumscard.url') }}
        </a>
      </b-col>
    </b-row>
  </b-alert>
</template>

<script>
export default {
  name: 'MuseumsCard'
}
</script>

<style scoped>
.museumscard-card {
  max-width: 310px;
  margin: auto;
}
.museumscard-logo {
  position: absolute;
  top: -33px;
  right: 0;
  margin-right: -1px;
  border-radius: 20px;
  padding: 25px 15px 10px;
}
</style>
