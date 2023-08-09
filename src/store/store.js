import Vue from 'vue'
import Vuex from 'vuex'
import institutions from './modules/institutions'
import filters from './modules/filters'
import userPosition from './modules/userPosition'
import VuexGeolocation from 'vuex-geolocation'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    institutions,
    filters,
    userPosition
  }
})

const vuexGeolocation = VuexGeolocation.sync(store, { autoWatch: false })
Vue.use(vuexGeolocation)

store.watch(() => store.getters['userPosition/getPosition'], (newPosition, oldPosition) => {
  if (newPosition.lat !== oldPosition.lat || newPosition.lng !== oldPosition.lng) {
    console.log('User-Position hat sich verändert:', oldPosition, newPosition)
    store.dispatch('institutions/sortInstitutionsByDistance', newPosition)
  }
})

export default store
