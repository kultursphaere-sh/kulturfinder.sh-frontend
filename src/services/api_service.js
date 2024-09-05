import { some } from 'lodash'
import Vue from 'vue'
import { localforageFavorites } from '@/localforage'
import router from '@/router'
import i18n from '@/i18n'

const TIMEOUT = 15000
const URL = 'https://kultursphaere.sh/corsproxy.php?url=http://xtree-actor-api.digicult-verbund.de'
const LivingImagesIds = [
  'act0002156', // Schauspielhaus
  /* 'act001653',  // Landesbibliothek SH */
  'act001696', // Weihachtshaus
  'act001621', // Mediendom
  'act0002152', // Bunker-D
  'act001610', // Computermuseum
  'act001651', // Weihnachtskarte-Storm-2021
  'act0002598', // Focke-Museum
  'act0002741', // Ozeaneum
  'act0002644' // Staldgarden Museum Kolding
]

function getCategories(array) {
  // check if ks categories available
  let results = array.map(getCategoryNameByCategoryUri).filter(Boolean)
  // prevent double entries
  return [...new Set(results)].sort()
}

function getCategoryNameByCategoryUri({ uri }) {
  const catId = 'categories.' + uri
  return i18n.te(catId) ? i18n.t(catId) : false
}

function getTagsByOptIds(array, hasLivingImages) {
  array = array.map(getTagNameByTagId).filter(Boolean)
  if (hasLivingImages) array.push('Living Image')
  return array.sort()
}

function getTagNameByTagId({ id }) {
  const tagId = 'tags.' + id
  return i18n.te(tagId) ? i18n.t(tagId) : false
}

function getHolidaysByIds(obj) {
  return Object.values(obj)
    .map(getHolidayNameById)
    .filter(Boolean)
}

function getHolidayNameById({ id }) {
  const holidayId = 'details.holidays.' + id
  return i18n.te(holidayId) ? i18n.t(holidayId) : false
}

function posToPosition(pos) {
  const lng = pos.substring(0, pos.lastIndexOf(' '))
  const lat = pos.substring(pos.lastIndexOf(' ') + 1, pos.length)
  return {
    lat: Number(lat),
    lng: Number(lng)
  }
}

function positionToCoords(position) {
  return `${position.lat}, ${position.lng}`
}

export class ApiService {
  async fetchInstitutions(locale) {
    const response = await Vue.http.get(`${URL}/getRepositoryList?portalURI=http://digicult.vocnet.org/portal/p0287&count=9999&lang=${locale}`,
      {
        timeout: TIMEOUT
      })

    const data = await response.json()
    const favorites = await localforageFavorites.keys()

    return Promise.all(data.Actor.map(async institution => {
      // choose shortname as name if exists
      if (institution.nameAddition) {
        institution.name = institution.nameAddition
      }

      if (institution.name === undefined) {
        institution.name = 'Unbekannter Name'
      }

      // set images (g - TODO: both needed?)
      institution.imageList = {}
      if (institution.resource && institution.resource.resourceRepresentation) {
        institution.imageList.thumbnail = institution.resource.resourceRepresentation.link
        institution.imageList.preview = institution.imageList.thumbnail.replace('thumbnail', 'preview_image')
        institution.imageList.provided = institution.imageList.thumbnail.replace('thumbnail', 'provided_image')
      }

      // create position object and coords string
      if (institution.pos) {
        institution.position = posToPosition(institution.pos)
        institution.coords = positionToCoords(institution.position)
      }

      /* TEST FOR LIVING IMAGES  */
      institution.hasLivingImages = LivingImagesIds.includes(institution.id)

      // get categories
      if (institution.classification) {
        const categoryUris = institution.classification.filter(classification => classification.type === 'tourismustyp')
        const categories = getCategories(categoryUris)
        if (categories.length > 0) {
          institution.categories = categories
        } else {
          console.log('No category: ', institution)
        }
      }

      // get tag names
      if (institution.icon) {
        let tags = getTagsByOptIds(institution.icon, institution.hasLivingImages)
        if (tags.length > 0) institution.tags = tags
      }

      // Set favorite state
      institution.isFavorite = some(favorites, id => institution.id === id)

      return institution
    }))
  }

  async fetchInstitution(id, locale) {
    const response = id.substr(0, 3) === 'act'
      ? await Vue.http.get(`${URL}/getRepositoryItem?id=${id}&lang=${locale}`)
      : await Vue.http.get(`${URL}/getRepositoryItem?info030=${id}&lang=${locale}`)

    if (!response.body.Actor.id) {
      router.push({ name: '404' })
      console.log('404 - Wrong ID, no such institution')
      return
    }
    const data = await response.json()

    const favorites = await localforageFavorites.keys()

    let institution = data.Actor

    console.debug('Details geholt: ', institution)

    // set preferred name as value for name property (identifier: name.role = preferred)
    institution.name = institution.name.find(item => item.role === 'preferred')
    if (institution.name.nameAddition) {
      institution.name = institution.name.nameAddition
    } else if (institution.name.label) {
      institution.name = institution.name.label
    } else {
      institution.name = 'Unbekannter Name'
    }

    if (institution.description) {
      // set claim property (identifier: description.id = info028)
      institution.claim = institution.description.find(item => item.id === 'info028')
      institution.claim = institution.claim ? institution.claim.noteValue[0] : ''

      // set description property (identifier: description.id = info029)
      let ksDescription = institution.description.find(item => item.id === 'info029')
      ksDescription = ksDescription ? ksDescription.noteValue[0] : null
      // if our description is yet missing fill in the digicult description for development purposes
      if (ksDescription == null) {
        institution.description = institution.description.find(item => item.id === 'info001')
        institution.description = institution.description ? '[digiCULT] ' + institution.description.noteValue[0] : 'Es ist noch keine Beschreibung vorhanden.'
      } else {
        institution.description = ksDescription
      }
    }

    // set address property (identifier: address.type = visitor)
    if (institution.address) institution.address = institution.address.find(item => item.type === 'visitor')

    if (institution.communication) {
      // set tel property (identifier: communication.id = com0022)
      institution.tel = institution.communication.find(item => item.id === 'com0022')
      institution.tel = institution.tel ? institution.tel.item : null

      // set email property (identifier: id = communication.com0024)
      institution.email = institution.communication.find(item => item.id === 'com0024')
      institution.email = institution.email ? institution.email.item : null
    }

    if (institution.webResource) {
      // set website property (identifier: webResource.source_id = webpage)
      institution.website = institution.webResource.find(item => item.source_id === 'webpage')
      if (!institution.website) institution.website = false

      // get event calender (identifier: webResource.source_id = c00297)
      institution.eventCalender = institution.webResource.find(item => item.source_id === 'c00297')
      if (!institution.eventCalender) institution.eventCalender = false

      // get social media (identifier: webResource.source_id = socialMedia)
      const socialMedia = institution.webResource.filter(item => item.source_id === 'socialMedia' && item.label)
      if (socialMedia.length > 0) {
        // set facebook property (identifier: label = Facebook)
        institution.facebook = socialMedia.find(item => item.label.toLowerCase() === 'facebook')
        institution.facebook = institution.facebook ? institution.facebook.identifier : null

        // set twitter property (identifier: label = Twitter)
        institution.twitter = socialMedia.find(item => item.label.toLowerCase() === 'twitter')
        institution.twitter = institution.twitter ? institution.twitter.identifier : null

        // set youtube property (identifier: label = YouTube)
        institution.youtube = socialMedia.find(item => item.label.toLowerCase() === 'youtube')
        institution.youtube = institution.youtube ? institution.youtube.identifier : null

        // set instagram property (identifier: label = Instagram)
        institution.instagram = socialMedia.find(item => item.label.toLowerCase() === 'instagram')
        institution.instagram = institution.instagram ? institution.instagram.identifier : null

        // set vimeo property (identifier: label = Vimeo)
        institution.vimeo = socialMedia.find(item => item.label.toLowerCase() === 'vimeo')
        institution.vimeo = institution.vimeo ? institution.vimeo.identifier : null
      }
      // set Audio property (Used in Slider in the Slider)
      institution.audio = institution.webResource.filter(item => item.source_id === 'c00123' && item.identifier)
      // set Video property (Used in Carousel Detail)
      institution.video = institution.webResource.filter(item => item.source_id === 'c00022' && item.identifier)

      // get digital services
      const digitalServices = {
        'c00023': '360',
        'c00052': 'audioguide',
        'c00020': 'augmentedReality',
        'c00024': 'chatbot',
        'c00025': 'multimedia',
        'c00021': 'virtualReality'
      }
      institution.digitalServices = institution.webResource
        .filter(item => item.source_id in digitalServices && item.label && item.identifier)
        .map(item => {
          item.icon = digitalServices[item.source_id]
          return item
        })
    } else {
      institution.digitalServices = false
    }

    // get apps
    institution.apps = {
      android: [],
      ios: []
    }
    if (institution.mapping) {
      institution.apps.ios = institution.mapping.filter(item => item.source_id === 'app_store_ios')
      institution.apps.android = institution.mapping.filter(item => item.source_id === 'app_store_android')
    }

    // if no website in database, check if isil available and set museen-nord page as website
    if (!institution.website) {
      if (institution.mapping) {
        const isil = institution.mapping.find((item) => item.source_id === 'ISIL')
        if (isil) {
          institution.website = {
            identifier: 'http://www.museen-nord.de/museum/' + isil.identifier,
            label: 'museen-nord.de'
          }
        }
      }
    }

    // set images (by kultursphaere identifier tag)
    if (institution.resource) {
      institution.images = institution.resource.filter(
        resource => resource.tag && resource.tag.toLowerCase().includes('kultursphäre')
      )

      institution.images.map(image => {
        image.imageList = {}
        image.imageList.thumbnail = image.resourceRepresentation[0].link
        image.imageList.preview = image.imageList.thumbnail.replace('thumbnail', 'preview_image')
        image.imageList.provided = image.imageList.thumbnail.replace('thumbnail', 'provided_image')

        return image
      })
    }

    // create position object and coords string
    if (institution.pos) {
      institution.position = posToPosition(institution.pos)
      institution.coords = positionToCoords(institution.position)
    }

    // get opening hours
    if (institution.openingTimes && institution.openingTimes.length > 0) {
      institution.openingTimes = institution.openingTimes[0]
    }

    // filter our used holidays
    if (institution.closedHolidays) {
      let holidays = getHolidaysByIds(institution.closedHolidays)
      if (holidays.length > 0) institution.closedHolidays = holidays
    }

    /* TEST FOR LIVING IMAGES  */
    institution.hasLivingImages = LivingImagesIds.includes(institution.id)

    // get categories
    if (institution.classification) {
      const categoryUris = institution.classification.filter(classification => classification.type === 'tourismustyp')
      const categories = getCategories(categoryUris)
      if (categories.length > 0) institution.categories = categories
    }

    // get tag names
    if (institution.icon) {
      let tags = getTagsByOptIds(institution.icon, institution.hasLivingImages)
      if (tags.length > 0) institution.tags = tags
    }

    // Set favorite state
    institution.isFavorite = some(favorites, id => institution.id === id)

    return institution
  }
}
