import { isEmpty, isEqual } from 'lodash'
import Vue from 'vue'
import Router from 'vue-router'
import i18n from '@/i18n'
import store from '@/store/store'

let lastLocale = ''
const defaultListType = 'map'
const actIdRegex = /^act\d{6,7}$/

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    /* Temp christmas routes */
    { path: '/weihnachtshaus', redirect: '/de/institutions/list/details/act001696' },
    { path: '/weihnachtsgruss', redirect: '/de/institutions/list/details/act001696/living-images' },
    /* Temp christmas routes end */
    { path: '/sbom.json' },
    { path: '/api/*' },
    { path: '/service-worker.js' },
    {
      path: '/:locale(de|en|da)?',
      component: {
        beforeRouteEnter: redirectOrSetLocale,
        beforeRouteUpdate: redirectOrSetLocale,
        /* router-view with keep-alive for child routes */
        render(h) {
          return h('keep-alive', [h('router-view')])
        }
      },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('./views/Dashboard.vue'),
          meta: {
            title: 'Start'
          }
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('./views/About.vue'),
          meta: {
            title: 'Informationen'
          }
        },
        {
          path: 'licenses',
          name: 'licenses',
          component: () => import('./views/Licenses.vue'),
          meta: {
            title: 'Lizenzen'
          }
        },
        {
          path: 'no-data',
          name: 'noData',
          component: () => import('./views/NoData.vue'),
          meta: {
            title: 'Keine Daten geladen'
          }
        },
        {
          path: 'no-data/about',
          name: 'noDataAbout',
          component: () => import('./views/About.vue'),
          meta: {
            title: 'Informationen',
            parent: 'noData'
          }
        },
        {
          path: 'institutions/:listType/museumscard',
          name: 'museumscard',
          component: () => import('./views/MuseumsCard.vue'),
          props: true,
          meta: {
            title: 'MuseumsCard'
          }
        },
        {
          path: 'institutions/:listType/cityOfLiterature',
          name: 'cityOfLiterature',
          component: () => import('./views/CityOfLiterature.vue'),
          props: true,
          meta: {
            title: 'City of Literature'
          }
        },
        {
          path: 'institutions',
          name: 'institutions',
          component: () => import('./views/Institutions.vue'),
          props: true,
          redirect: 'institutions/map',
          children: [
            {
              path: ':listType(map)',
              name: 'map',
              component: () => import('./components/common/Map.vue'),
              props: true,
              meta: {
                title: 'Karte',
                parent: 'dashboard'
              }
            },
            {
              path: ':listType(list)',
              name: 'list',
              component: () => import('./components/institutions/List.vue'),
              props: true,
              meta: {
                title: 'Liste',
                parent: 'dashboard'
              }
            }
          ]
        },
        {
          path: 'institutions/:listType/filters',
          name: 'filters',
          component: () => import('./views/Filters.vue'),
          props: true,
          meta: {
            title: 'Filter'
          }
        },
        {
          path: 'institutions/:listType?/details/:actId',
          alias: [':actId'],
          name: 'details',
          component: () => import('./views/details/Details.vue'),
          props: true,
          meta: {
            title: 'Details'
          }
        },
        {
          path: 'institutions/:listType/details/:actId/map',
          name: 'detailsMap',
          component: () => import('./views/details/Map.vue'),
          props: true,
          meta: {
            title: 'Karte',
            parent: 'details'
          }
        },
        {
          path: 'institutions/:listType?/details/:actId/about',
          name: 'detailsAbout',
          component: () => import('./views/About.vue'),
          meta: {
            title: 'Informationen',
            parent: 'details'
          }
        },
        {
          path: 'institutions/:listType?/details/:id/living-images',
          name: 'arWrapper',
          alias: ['li/:id'],
          component: () => import('./views/details/ARWrapper.vue'),
          props: true,
          meta: {
            title: 'ARWrapper'
          }
        }
      ]
    },
    // never reached, see router.push in institution_service.js -> fetchInstitution()
    {
      name: '404',
      path: '*',
      redirect: '/de'
    }
  ]
})

router.onReady(async () => {
  // await waitForStorageToBeReady()

  setInitialFilterStateFromUrl()

  startListeningToRouteChanges()
})

const setInitialFilterStateFromUrl = () => {
  store.dispatch('filters/updateState', queryStringsToState(router.currentRoute.query)).then()
}

/*
 * Add filter query parameters from store to url/route on every navigation.
 * So not every link has to include the current query parameters...
 */
const startListeningToRouteChanges = () => {
  router.beforeEach(async (to, from, next) => {
    // next if store filter matches query
    if (isEqual(to.query, store.getters['filters/getFilterQuery'])) next()
    else {
      // Set new filter state if query is present
      if (!isEmpty(to.query)) await store.dispatch('filters/updateState', queryStringsToState(to.query))

      // Deprecated?! Append current filter query to url
      next(/* { path: to.path, query: store.getters['filters/getFilterQuery'] } */)
    }
  })
}

/*
 * Transform comma separated filters from query strings
 * to state object with arrays.
 */
const queryStringsToState = (query = {}) => {
  const {
    isFavorite = '',
    categories = '',
    tags = '',
    searchQuery = ''
  } = query

  return {
    isFavorite: isFavorite === 'true',
    categories: categories.length ? categories.split(',') : [],
    tags: tags.length ? tags.split(',') : [],
    searchQuery
  }
}

/* Redirect missing locale and alias URLs */
async function redirectOrSetLocale(to, from, next) {
  let { locale, listType, actId } = to.params

  if (!locale) {
    /* Set missing list type for short URLs */
    if (to.params.hasOwnProperty('listType') && !listType) {
      to.params.listType = defaultListType
    }

    to.params.locale = 'de'

    /* Routes by name, so alias routes are resolved to their full route */
    next(to)
    return
  }

  // Set locale and fetch new localized data
  if (locale !== lastLocale) {
    i18n.locale = lastLocale = locale
    await store.dispatch('institutions/fetchInstitutions')
  }

  if (actId && !actId.match(actIdRegex)) {
    const response = store.getters['institutions/getActIdByTitle'](actId)

    to.params.actId = response || actId
  }
  next()
}

export default router
