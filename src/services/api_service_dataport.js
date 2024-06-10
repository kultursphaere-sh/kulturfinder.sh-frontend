/// <reference path="../../node_modules/vue/dist/vue.runtime.esm.js" />

/** @typedef {'de' | 'en' | 'da'}  ApiDpLocale
 */

/** @typedef ApiDpGetInstitutesBasicInformationItemDto
 * @property {number} id
 * @property {[ApiDpCategory]} categories
 * @property {[ApiDpTag]} tags
 * @property {[ApiDpCommunication]} communications
 * @property {[ApiDpMediaItem]} media
 * @property {[ApiDpOpeningHour]} openingHours
 * @property {string} specialOpeningHours
 * @property {ApiDpClosedDaysItem} closedDays
 * @property {[ApiDpTranslation]} specialClosedDays
 * @property {boolean} visible
 * @property {string} dataRights
 * @property {string} workingState
 * @property {[ApiDpTranslation]} name
 * @property {[ApiDpTranslation]} nameAddition
 * @property {string} description
 * @property {id: number, state: string, name: string} region
 * @property {[ApiDpTranslation]} address
 * @property {string} name_c_o
 * @property {string} zipCode
 * @property {[ApiDpTranslation]} city
 * @property {string} latitude
 * @property {string} longitude
 * @property {boolean} hasLivingImages
 */

/** @typedef ApiDpGetInstituteDetailsDto
 * @property {number} id
 * @property {[ApiDpCategory]} categories
 * @property {[ApiDpTag]} tags
 * @property {[ApiDpCommunication]} communications
 * @property {[ApiDpMediaItem]} media
 * @property {[ApiDpOpeningHour]} openingHours
 * @property {string} specialOpeningHours
 * @property {[ApiDpTranslation]} specialClosedDays
 * @property {boolean} visible
 * @property {string} dataRights
 * @property {string} workingState
 * @property {[ApiDpTranslation]} name
 * @property {[ApiDpTranslation]} nameAddition
 * @property {string} description
 * @property {id: number, state: string, name: string} region
 * @property {[ApiDpTranslation]} address
 * @property {string} name_c_o
 * @property {string} zipCode
 * @property {[ApiDpTranslation]} city
 * @property {string} latitude
 * @property {string} longitude
 * @property {boolean} hasLivingImages
 */

/** @typedef ApiDpPostInstitutionsDto
 * @property {number} id
 * @property {[ApiDpCategory]} categories
 * @property {[ApiDpTag]} tags
 * @property {[ApiDpCommunication]} communications
 * @property {[ApiDpMediaItem]} media
 * @property {[ApiDpOpeningHour]} openingHours
 * @property {string} specialOpeningHours
 * @property {[ApiDpTranslation]} specialClosedDays
 * @property {boolean} visible
 * @property {string} dataRights
 * @property {string} workingState
 * @property {[ApiDpTranslation]} name
 * @property {[ApiDpTranslation]} nameAddition
 * @property {string} description
 * @property {id: number, state: string, name: string} region
 * @property {[ApiDpTranslation]} address
 * @property {string} name_c_o
 * @property {string} zipCode
 * @property {[ApiDpTranslation]} city
 * @property {string} latitude
 * @property {string} longitude
 * @property {boolean} hasLivingImages
 */

/** @typedef ApiDpTranslation
 * @property {string} language
 * @property {string} text
 */

/** @typedef ApiDpTag
 * @property {number} id
 * @property {ApiDpTranslation} text
 */

/** @typedef ApiDpCategory
 * @property {number} id
 * @property {ApiDpTranslation} name
 */

/** @typedef ApiDpCommunication
 * @property {number} id
 * @property {string} communicationType
 * @property {string} value
 */

/** @typedef ApiDpMediaItem
 * @property {number} id
 * @property {string} mediaType
 * @property {string} alternateText
 * @property {string} filename
 * @property {string} copyright
 * @property {string} artist
 * @property {number} order
 */

/** @typedef ApiDpOpeningHour
 * @property {number} id
 * @property {string} activeStartDate
 * @property {string} activeEndDate
 * @property {boolean} priority
 * @property {boolean} visible
 * @property {boolean} isEveryYear
 * @property {[ApiDpTranslation]} comment
 * @property {[ApiDpOpeningHourOpenedTimes]} openedTimes
 */

/** @typedef ApiDpOpeningHourOpenedTimes
 * @property {number} weekday
 * @property {string} openTime
 * @property {string} closeTime
 */

/** @typedef ApiDpClosedDaysItem
 * @property {string} date
 * @property {string} text
 * @property {boolean} isEveryYear
 */

import Vue from 'vue'
import { some } from 'lodash'
import { localforageFavorites } from '@/localforage'
import router from '@/router'

const TIMEOUT = 15000
const URL = '/api'

function latLngToPos(latitude, longitude) {
  return {
    position: { lat: latitude, lng: longitude },
    coords: `${latitude}, ${longitude}`
  }
}

/**
 * @type Function
 * @param {ApiDpGetInstitutesBasicInformationItemDto} element
 * @return {Institution}
 */
function migrateCommonValues(element) {
  let institution = {}
  institution.id = element.id.toString()
  institution.name = element.name || 'Unbekannter Name'
  institution.teaser = element.nameAddition
  institution.claim = element.nameAddition
  institution.description = element.description
  institution.address = {
    street: element.address,
    zip: element.zipCode,
    place: element.city
  }
  institution.street = element.address
  institution.place = element.city
  institution.hasLivingImages = element.hasLivingImages

  if (element.latitude && element.longitude) {
    Object.assign(institution, latLngToPos(element.latitude, element.longitude))
  }

  institution.categories = [...new Set(element.categories.map(category => category.name))]
    .sort((a, b) => { return a - b })
  institution.tags = [...element.tags.map(tag => tag.name)]
    .sort((a, b) => { return a - b })

  if (!institution.audio) institution.audio = []
  if (!institution.images) institution.images = []
  if (!institution.video) institution.video = []
  if (!institution.imageList) institution.imageList = {}
  element.media.forEach(media => {
    const imageList = {
      preview: `${URL}/Media/GetMedia?id=${media.id}&asThumbnail=true`,
      provided: `${URL}/Media/GetMedia?id=${media.id}&asThumbnail=false`,
      thumbnail: `${URL}/Media/GetMedia?id=${media.id}&asThumbnail=true`
    }
    switch (media.mediaType) {
      case 'Image':
        if (media.order === 0) {
          institution.imageList = imageList
        }
        institution.images.push({ imageList: imageList })
        break
      case 'Audio':
        institution.audio.push(`${URL}/Media/GetMedia?id=${media.id}`)
        break
      case 'Video':
        institution.video.push(`${URL}/Media/GetMedia?id=${media.id}`)
        break
    }
  })

  if (institution.images.length === 0) {
    const randomValue = Math.floor(Math.random() * 2)
    institution.imageList = {
      preview: `/hb/img/placeholder_${randomValue}.jpg`,
      provided: `/hb/img/placeholder_${randomValue}.jpg`,
      thumbnail: `/hb/img/placeholder_${randomValue}.jpg`
    }
    institution.images.push({
      imageList: {
        preview: `/hb/img/placeholder_${randomValue}.jpg`,
        provided: `/hb/img/placeholder_${randomValue}.jpg`,
        thumbnail: `/hb/img/placeholder_${randomValue}.jpg`
      }
    })
  }

  return institution
}

/**
 * @type Function
 * @param {Array.<{weekday: number, openTime: string, closeTime: string}>} openingTimes
 * @return {{first: {timeStart: string, timeEnd: string}, second: {timeStart: string, timeEnd: string}}}
 */
function createOpeningTimesObject(openingTimes) {
  const day = {}
  const empty = {
    timeStart: '',
    timeEnd: ''
  }
  switch (openingTimes.length) {
    case 0:
      day.first = day.second = empty
      break
    case 1:
      day.first = {
        timeStart: 'T' + openingTimes[0].openTime,
        timeEnd: 'T' + openingTimes[0].closeTime
      }
      day.second = empty
      break
    case 2:
      day.first = {
        timeStart: 'T' + openingTimes[0].openTime,
        timeEnd: 'T' + openingTimes[0].closeTime
      }
      day.second = {
        timeStart: 'T' + openingTimes[1].openTime,
        timeEnd: 'T' + openingTimes[1].closeTime
      }
  }
  return day
}

/**
 * @type Function
 * @param {ApiDpGetInstitutesBasicInformationItemDto} dto
 * @return {Object.<{week: {
 * mon: {first: {timeStart: string, timeEnd: string}, second: {timeStart: string, timeEnd: string}}
 * tue: {first: {timeStart: string, timeEnd: string}, second: {timeStart: string, timeEnd: string}},
 * wen: {first: {timeStart: string, timeEnd: string}, second: {timeStart: string, timeEnd: string}},
 * thu: {first: {timeStart: string, timeEnd: string}, second: {timeStart: string, timeEnd: string}},
 * fri: {first: {timeStart: string, timeEnd: string}, second: {timeStart: string, timeEnd: string}},
 * sat: {first: {timeStart: string, timeEnd: string}, second: {timeStart: string, timeEnd: string}},
 * sun: {first: {timeStart: string, timeEnd: string}, second: {timeStart: string, timeEnd: string}}
 * }, description: string}> | undefined}
 */
function migrateOpeningHours(dto) {
  if (!dto) return undefined
  if (!dto.openingHours) return undefined
  if (!dto.openingHours[0]) return undefined

  const element = dto.openingHours[0].openedTimes

  let mondayTimes = element
    .filter(time => time.weekday === 0)
    .sort((a, b) => {
      return Number.parseInt(a.openTime.slice(0, 1)) - Number.parseInt(b.openTime.slice(0, 1))
    })
  let mon = createOpeningTimesObject(mondayTimes)

  let tuesdayTimes = element
    .filter(time => time.weekday === 1)
    .sort((a, b) => { return Number.parseInt(a.openTime.slice(0, 1)) - Number.parseInt(b.openTime.slice(0, 1)) })
  let tue = createOpeningTimesObject(tuesdayTimes)

  let wednesdayTimes = element
    .filter(time => time.weekday === 2)
    .sort((a, b) => { return Number.parseInt(a.openTime.slice(0, 1)) - Number.parseInt(b.openTime.slice(0, 1)) })
  let wen = createOpeningTimesObject(wednesdayTimes)

  let thursdayTimes = element
    .filter(time => time.weekday === 3)
    .sort((a, b) => { return Number.parseInt(a.openTime.slice(0, 1)) - Number.parseInt(b.openTime.slice(0, 1)) })
  let thu = createOpeningTimesObject(thursdayTimes)

  let fridayTimes = element
    .filter(time => time.weekday === 4)
    .sort((a, b) => { return Number.parseInt(a.openTime.slice(0, 1)) - Number.parseInt(b.openTime.slice(0, 1)) })
  let fri = createOpeningTimesObject(fridayTimes)

  let saturdayTimes = element
    .filter(time => time.weekday === 5)
    .sort((a, b) => { return Number.parseInt(a.openTime.slice(0, 1)) - Number.parseInt(b.openTime.slice(0, 1)) })
  let sat = createOpeningTimesObject(saturdayTimes)

  let sundayTimes = element
    .filter(time => time.weekday === 6)
    .sort((a, b) => { return Number.parseInt(a.openTime.slice(0, 1)) - Number.parseInt(b.openTime.slice(0, 1)) })
  let sun = createOpeningTimesObject(sundayTimes)
  return {
    openingTimes: {
      week: {
        mon: mon,
        tue: tue,
        wen: wen,
        thu: thu,
        fri: fri,
        sat: sat,
        sun: sun
      }
    }
  }
}

export class ApiServiceDataport {
  async fetchInstitutions(locale) {
    const response = await Vue.http.get(`${URL}/Institute/GetInstitutes/VisibleInstitutes/BasicInformation`,
      {
        params: { 'language': locale },
        timeout: TIMEOUT
      })
    /** @type [ApiDpGetInstituteDetailsDto] */
    const data = await response.json()
    const favorites = await localforageFavorites.keys()

    return Promise.all(data.map(
      /** @type {Function}
       * @param {ApiDpGetInstitutesBasicInformationItemDto} element
       * @return {Institution}}
       */
      async (element) => {
      /** @type Institution */
        let institution = {}
        institution.isFavorite = some(favorites, id => element.id.toString() === id)

        Object.assign(institution, migrateCommonValues(element))

        return institution
      }))
  }

  /** @return {Promise.<Institution>} */
  async fetchInstitution(id, locale) {
    const response = await Vue.http.get(`${URL}/Institute/GetInstitute/${id}/AllDetails`,
      {
        params: { 'language': locale },
        timeout: TIMEOUT
      })
    /** @type {ApiDpGetInstitutesBasicInformationItemDto} */
    const institutionDto = await response.json()
    const favorites = await localforageFavorites.keys()

    if (!institutionDto.id) {
      await router.push({ name: '404' })
      throw Error('404 - Wrong ID, no such institution')
    }

    /** @type Institution */
    let institution = {}
    institution.isFavorite = some(favorites, id => institution.id === id)
    Object.assign(institution, migrateCommonValues(institutionDto))

    institutionDto.communications.forEach(communication => {
      switch (communication.communicationType) {
        case 'Telephone':
          institution.tel = communication.value
          break
        case 'Email':
          institution.email = communication.value
          break
        case 'Website':
          institution.website = { label: 'Website', identifier: communication.value }
          break
        case 'EventUrl':
          institution.eventCalender = {
            identifier: communication.value
          }
          break
        case 'Facebook':
          institution.facebook = communication.value
          break
        case 'Instagram':
          institution.instagram = communication.value
          break
        case 'Twitter':
          institution.twitter = communication.value
          break
        case 'Youtube':
          institution.youtube = communication.value
          break
        case 'Vimeo':
          institution.vimeo = communication.value
          break
        case 'Audio':
          institution.audio = communication.value
          break
        case 'Video':
          institution.video = communication.value
          break
        case 'DigitalServices':
          institution.digitalServices = communication.value
          break
      }
    })

    Object.assign(institution, migrateOpeningHours(institutionDto))
    if (!institution.openingTimes) institution.openingTimes = {}
    if (institutionDto.specialOpeningHours) institution.openingTimes.description = institutionDto.specialOpeningHours
    if (institutionDto.closedDays && institutionDto.closedDays.length > 0) {
      if (!institution.closedHolidays) institution.closedHolidays = []
      institutionDto.closedDays.map(element => institution.closedHolidays.push(element.text))
    }

    return institution
  }
}
