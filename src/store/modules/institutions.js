import { compact, countBy, flatten, map, orderBy, some, uniq } from 'lodash'
import institutionService from '@/services/institution_service'
import { localforageFavorites } from '@/localforage'
import geolocationUtilities from 'vuex-geolocation/dist/geolocation-utilities'
import actIdHistory from '@/assets/actid-history.json'

export default {
  namespaced: true,
  state: {
    institutions: [],
    timeout: false
  },
  getters: {
    getAll: (state) => state.institutions,
    getTimeout: (state) => state.timeout,
    getFiltered: (state, getters, rootState) => {
      const filteredInstitutions = state.institutions.filter(institution => {
        if (rootState.filters.categories.length > 0) {
          if (!institution.categories) return false

          let categoryMatched = false

          for (let activeCat of rootState.filters.categories) {
            if (institution.categories.indexOf(activeCat) !== -1) {
              categoryMatched = true
            }
          }

          if (!categoryMatched) return false
        }

        if (rootState.filters.tags.length > 0) {
          if (!institution.tags) return false
          for (let activeTag of rootState.filters.tags) {
            if (institution.tags.indexOf(activeTag) === -1) {
              return false
            }
          }
        }

        if (rootState.filters.searchQuery && rootState.filters.searchQuery !== '') {
          let criteria = [
            institution.place,
            institution.name,
            institution.teaser
          ].filter(crit => crit !== undefined)

          const lowerCaseSearchQuery = rootState.filters.searchQuery.toLowerCase()

          if (!some(criteria, item => item.toLowerCase().match(lowerCaseSearchQuery))) {
            return false
          }
        }

        return !(rootState.filters.isFavorite && !institution.isFavorite)
      })
      console.log('Gefilterte Institutionen:', filteredInstitutions.length)

      return filteredInstitutions
    },
    getById: (state) => (id) => state.institutions.find(institution => {
      return institution.id === id
    }),
    getByTitle:
      (state) =>
        (title) =>
          state.institutions.find(institution => institution.name.toLowerCase() === title.toLowerCase()),
    getCategories: (state) => {
      return uniq(compact(flatten(map(state.institutions, 'categories')))).sort()
    },
    getAllTags: (state) => {
      const allTags = compact(flatten(map(state.institutions, 'tags')))
      const tagsWithCount = map(countBy(allTags), (count, name) => ({ name, count }))
      const sortedTags = orderBy(tagsWithCount, ['count', 'name'], ['desc', 'asc'])
      return sortedTags.map(tag => tag.name)
    },
    getCount: (state, getters) => getters.getAll.length > 100
      ? '100+'
      : getters.getAll.length,
    getFilteredCount: (state, getters) => getters.getFiltered.length > 100
      ? '100+'
      : getters.getFiltered.length,
    getLivingImages: (state) => state.institutions.filter(institution => institution.hasLivingImages === true),
    getActIdByTitle: (state, getters) => (title) => {
      const { id } = getters.getByTitle(title) || getters.findActIdInHistoryByTitle(title) || {}
      return id
    },
    findActIdInHistoryByTitle: () => (title) =>
      Array.isArray(actIdHistory) &&
      actIdHistory.find(actItem => actItem.titles.map(t => t.toLowerCase()).indexOf(title.toLowerCase()) !== -1)
  },
  mutations: {
    save: (state, data) => {
      state.institutions = data
    },
    saveDetails: (state, data) => {
      const institution = state.institutions.find(institution => institution.id === data.id)
      Object.assign(institution, data)
    },
    saveTimeout: (state, data) => {
      state.timeout = data
    }
  },
  actions: {
    async updateIsFavorite({ commit }, institution) {
      institution.isFavorite = !institution.isFavorite

      try {
        if (institution.isFavorite) {
          await localforageFavorites.setItem(institution.id, institution)
        } else {
          await localforageFavorites.removeItem(institution.id)
        }

        commit('saveDetails', institution)
      } catch (error) {
        console.error('Saving favorite state failed!', error)
        institution.isFavorite = !institution.isFavorite
      }
    },
    async fetchInstitutions({ dispatch, commit, rootGetters }) {
      try {
        const institutions = await institutionService.getInstitutions()
        const userPosition = rootGetters['userPosition/getPosition']

        commit('save', institutions)
        commit('saveTimeout', false)

        console.log(institutions.length + ' Institutionen geladen.', rootGetters)
        if (userPosition) {
          dispatch('sortInstitutionsByDistance', userPosition)
        }
      } catch (e) {
        commit('saveTimeout', true)
      }
    },
    async fetchDetails({ commit, getters }, { id, locale }) {
      try {
        const institution = await institutionService.getInstitution(id, locale)
        if (institution !== undefined) {
          commit('saveDetails', institution)
          return getters.getById(institution.id)
        }
        commit('saveTimeout', false)
      } catch (error) {
        console.error('Error while fetching details:', error)
        return { ...getters.getById(id), hasDetails: false }
      }
    },
    sortInstitutionsByDistance({ commit, state }, userPosition) {
      if (state.institutions.length) {
        const institutions = orderByDistance(addDistance(state.institutions, userPosition))
        console.log('Institutionen wurden nach Entfernung sortiert')
        commit('save', institutions)
      }
    }
  }
}

function addDistance(institutions, { lat, lng }) {
  for (let institution of institutions) {
    institution.distance = geolocationUtilities.getGeoDistance(
      { lat, lng },
      institution.position
    )
    institution.distanceText = convertMeters(institution.distance)
  }
  return institutions
}

function orderByDistance(institutions) {
  let sorted = []
  if (institutions.length > 0) {
    sorted = institutions.slice().sort(function (a, b) {
      let comp = 0
      if (a.distance > b.distance) {
        comp = 1
      } else if (a.distance < b.distance) comp = -1
      return comp
    })
  }
  return sorted
}

function convertMeters(value) {
  if (!value) return ''
  if (value < 1000) {
    value = Math.round(value) + ' m'
  } else {
    value /= 1000
    value = (Math.round(value * 10) / 10) + ' km'
    value = value.replace('.', ',')
  }
  return value
}
