import { isEqual } from 'lodash'
import router from '@/router'

const getDefaultState = () => {
  return {
    isFavorite: false,
    searchQuery: '',
    tags: [],
    categories: []
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    getAllFilters: (state) => {
      const filters = [...state.categories, ...state.tags]
      if (state.isFavorite) filters.push('isFavorite')
      return filters
    },
    getFilterQuery: (state) => {
      const query = {}
      if (state.isFavorite) query.isFavorite = state.isFavorite
      if (state.categories.length) query.categories = state.categories.join(',')
      if (state.tags.length) query.tags = state.tags.join(',')
      if (state.searchQuery.length) query.searchQuery = state.searchQuery
      return query
    }
  },
  mutations: {
    saveState: function (state, data) {
      Object.assign(state, data)
    },
    saveIsFavorite: function (state, data) {
      state.isFavorite = data
    },
    saveTags: function (state, data) {
      state.tags = data
    },
    saveCategories: function (state, data) {
      state.categories = data
    },
    saveSearchQuery: function (state, data) {
      state.searchQuery = data
    },
    resetFilters: function (state) {
      Object.assign(state, getDefaultState())
    }
  },
  actions: {
    updateState({ commit }, state) {
      return commit('saveState', state)
    },
    updateIsFavorite({ commit }, isFavorite) {
      commit('saveIsFavorite', isFavorite)
    },
    updateTags({ commit }, tags) {
      commit('saveTags', tags)
    },
    updateCategories({ commit }, categories) {
      commit('saveCategories', categories)
    },
    updateSearchQuery({ commit, getters }, searchQuery) {
      commit('saveSearchQuery', searchQuery)

      const query = getters['getFilterQuery']

      /* Add new search query to url */
      if (!isEqual(query, router.currentRoute.query)) router.replace({ query })
    },
    resetFilters({ commit }) {
      commit('resetFilters')
    }
  }
}
