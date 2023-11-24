<template>
  <div id="licenses">
    <vue-headful
      :title="$t('about.licenses.licenses') + ' | ' + appName"
      :description="appDescription"
      :keywords="appKeywords"
      :lang="`/${$route.params.locale}/`"
      og-locale="de"
      :url="appURL"
    />
    <ks-header :header-title="$t('licenses.licenses')"/>

    <div id="main-container" v-scroll-lock="true">
      <div id="main-content">
        <b-container class="p-4">
          <section id="overview" class="py-3">
            <h1>{{ $t('licenses.summary') }}</h1>
            <table>
              <tr>
                <th>{{ $t('licenses.license') }}</th>
                <th>{{ $t('licenses.amount') }}</th>
              </tr>
              <tr v-for="element in this.allLicenses" :key="element.license.name">
                <td>{{ element.license }}</td>
                <td>{{ element.amount }}</td>
              </tr>
            </table>
          </section>
          <section>
            <h1>{{ $t('licenses.multi') }}</h1>
            <table>
              <tr>
                <th>{{ $t('licenses.license') }}</th>
                <th>{{ $t('licenses.choice') }}</th>
              </tr>
              <tr v-for="element in this.multiLicenses" :key="element.name">
                <td>{{ element.name }}</td>
                <td>{{ element.choice }}</td>
              </tr>
            </table>
          </section>
          <section>
            <h1>{{ $t('licenses.license') + $t('licenses.colon') }}</h1>
            <div v-for="element in summary" :key="element.packageName">
              <div><em>{{ element.packageName + $t('licenses.colon') }}</em></div>
              <span v-if="element.author">{{ $t('licenses.author') + element.author }}</span>
              <div v-for="license in element.licenses" :key="element.packageName+license">
                <div v-if="license">{{ license }}</div>
              </div>
            </div>
          </section>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import KsHeader from '@/components/layout/Header.vue'
import ScrollPosition from '@/mixins/scrollposition'

export default {
  name: 'Licenses',
  components: {
    KsHeader
  },
  mixins: [ScrollPosition],
  data() {
    return {
      allLicenses: [{ license: 'Keine Lizenz gefunden', amount: 0 }],
      summary: [],
      multiLicenses: [
        { name: 'amdefine', choice: 'MIT' }
      ]
    }
  },
  computed: {
    appURL: function () { return process.env.VUE_APP_URL },
    appName: function () { return process.env.VUE_APP_NAME },
    appDescription: function () { return process.env.VUE_APP_DESCRIPTION },
    appKeywords: function () { return process.env.VUE_APP_KEYWORDS }
  },
  created() {
    fetch('/sbom.json')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        data.components.sort((a, b) => (a.group + a.name).localeCompare(b.group + b.name))
        data.components.forEach(component => {
          let name = ''
          if (component.group) {
            name += component.group + '/'
          }
          name += component.name

          let element = {
            packageName: name,
            author: component.author,
            licenses: []
          }

          if (component.licenses) {
            component.licenses.forEach((license) => {
              let currentLicence
              if (license.license !== undefined) {
                currentLicence = license.license.id ? license.license.id : license.license.name
              } else if (license.expression !== undefined) {
                currentLicence = license.expression
              } else {
                this.allLicenses.filter(e => e.license === 'Keine Lizenz gefunden')[0].amount += 1
              }

              element.licenses.push(currentLicence)

              if (this.allLicenses.some(e => e.license === currentLicence)) {
                this.allLicenses.filter(e => e.license === currentLicence)[0].amount += 1
              } else {
                this.allLicenses.push({ license: currentLicence, amount: 1 })
              }
            })
          }
          this.summary.push(element)
        })
      })
  }
}
</script>

<style scoped>

</style>
