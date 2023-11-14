<template>
  <div id="details-map">
    <vue-headful
      :title="institution.name + ' | ' + $t('SEO.title')"
      :description="$t('SEO.description')"
      :keywords="$t('SEO.commonKeywords')"
      :lang="`/${$route.params.locale}/`"
      og-locale="de"
      url="https://kulturfinder.sh"
    />
    <ks-header :header-title="$t('common.map')"/>

    <div id="main-container" v-scroll-lock="true">
      <div id="main-content" class="full-width h-100">
        <ks-map v-if="!loading" :institutions="[institution]"/>
      </div>
    </div>
  </div>
</template>

<script>
import KsHeader from '@/components/layout/Header.vue'
import KsMap from '@/components/common/Map.vue'
import ScrollPosition from '@/mixins/scrollposition'

export default {
  name: 'DetailsMap',
  components: {
    KsMap,
    KsHeader
  },
  mixins: [ScrollPosition],
  data() {
    return {
      institution: {},
      loading: true
    }
  },
  props: {
    actId: {
      type: String,
      default: ''
    },
    listType: {
      type: String,
      default: 'list'
    }
  },
  async activated() {
    if (!this.loading) this.loading = true
    let data = await this.$store.getters['institutions/getById'](this.actId)
    if (data === undefined) {
      await this.$store.dispatch('institutions/fetchDetails', { id: this.actId })
      data = await this.$store.getters['institutions/getById'](this.actId)
    }
    this.center = data.position
    this.institution = data
    this.loading = false
  }
}
</script>
