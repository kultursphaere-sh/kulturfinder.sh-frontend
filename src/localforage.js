import localforage from 'localforage'

localforage.config({
  name: 'kulturfinder',
  storeName: 'common'
})

// import this module to get favorites by localforageFavorites.keys()
export const localforageFavorites = localforage.createInstance({
  name: 'kulturfinder',
  storeName: 'favorites'
})

export default localforage
