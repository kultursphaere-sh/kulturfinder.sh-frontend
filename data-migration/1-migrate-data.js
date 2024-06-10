/** @type {{}} */
const exportData = require('./output/export_data.json')
const fetch = require('node-fetch')
const fs = require('fs')
const localeFiles = {
  de: require('../src/locales/de.json'),
  en: require('../src/locales/en.json'),
  da: require('../src/locales/da.json')
}

/**
 * @type Function
 * @param {[ExportDataIcon]} iconsArray
 * @param {ApiDpLocale} locale
 * @return {[ApiDpTag]}
 */
function migrateIconsIntoTags(iconsArray, locale) {
  /** @type [ApiDpTag] */
  let migratedTags = []
  iconsArray.forEach(icon => {
    const iconText = localeFiles[locale].tags[icon.id]
    if (!iconText) {
      if (!tagsUnknown.some(tag => tag === icon.id)) {
        tagsUnknown.push(icon.id)
      }
    } else {
      const availableTag = tags.find(tag => {
        return tag.text.find(tagText => { return tagText.text === iconText })
      })
      if (availableTag) {
        migratedTags.push(availableTag)
      } else {
        if (!tagsNotInNewApiAvailable.some(tag => tag === icon.id)) {
          tagsNotInNewApiAvailable.push(icon.id)
        }
      }
    }
  })
  return migratedTags
}

/**
 * @type Function
 * @param {[ExportDataClassification]} classificationsArray
 * @param {ApiDpLocale} locale
 * @param {string} actorId
 * @return {[ApiDpCategory]}
 */
function migrateClassificationsToCategories(classificationsArray, locale, actorId) {
  let migratedCategories = []
  classificationsArray.forEach(classification => {
    if (classification.type === 'tourismustyp') {
      let classificationId = classification.uri.replace('http://digicult.vocnet.org/portal/', '')
      let classificationText = localeFiles[locale].categories['http://digicult']['vocnet'][`org/portal/${classificationId}`]
      if (!classificationText) {
        if (!categoriesUnknown.some(category => category === classificationText)) {
          categoriesUnknown.push(actorId)
        }
      } else {
        const availableCategory = categories.find(category => {
          return category.name.find(categoryName => { return categoryName.text === classificationText })
        })
        if (availableCategory) {
          migratedCategories.push(availableCategory)
        } else {
          if (!categoriesNotInNewApiAvailable.some(category => category === classificationText)) {
            categoriesNotInNewApiAvailable.push(classificationText)
          }
        }
      }
    }
  })
  return migratedCategories
}

/**
 * @type Function
 * @param {ExportDataBasicInfo} basicInfo
 * @param {ApiDpPostInstitutionsDto} institution
 * @param {ApiDpLocale} locale
 * @return void
 */
function migrateBasicInformation(basicInfo, institution, locale) {
  if (Number(basicInfo.id.replace('act', '1')) !== institution.id) {
    throw new Error(`ERROR: different IDs found: ${basicInfo.id} !== ${institution.id}`)
  }

  if (!basicInfo.name) {
    throw new Error(`ERROR: no name available ${JSON.stringify(basicInfo)} ${locale}`)
  }
  if (!institution.name) {
    institution.name = []
  }
  institution.name.push({ language: locale, text: basicInfo.name })

  if (!basicInfo.pos) {
    throw new Error(`ERROR: no pos available ${JSON.stringify(basicInfo)} ${locale}`)
  }
  if (!institution.latitude || !institution.longitude) {
    institution.latitude = basicInfo.pos.split(' ')[1]
    institution.longitude = basicInfo.pos.split(' ')[0]
  }

  if (!institution.nameAddition) {
    institution.nameAddition = []
  }
  if (basicInfo.teaser) {
    institution.nameAddition.push({ language: locale, text: basicInfo.teaser })
  }

  if (!basicInfo.icon) {
    console.error(`ERROR: no icon available ${basicInfo.id} ${basicInfo.name} ${locale}`)
  } else {
    if (!institution.tags) {
      institution.tags = []
    }
    migrateIconsIntoTags(basicInfo.icon, locale).forEach(newTag => {
      if (!institution.tags.find(existingTag => JSON.stringify(existingTag) === JSON.stringify(newTag))) {
        institution.tags.push(newTag)
      }
    })
  }

  if (!basicInfo.classification) {
    console.error(`ERROR: no classification available ${basicInfo.id} ${basicInfo.name} ${locale}`)
  } else {
    if (!institution.categories) {
      institution.categories = []
    }
    migrateClassificationsToCategories(basicInfo.classification, locale, basicInfo.id).forEach(newCategory => {
      if (!institution.categories.find(existingCategory => JSON.stringify(existingCategory) === JSON.stringify(newCategory))) {
        institution.categories.push(newCategory)
      }
    })
  }
  // resource only sends thumbnails on basicInformation
  // links not needed
}

/**
 * @type Function
 * @param {[ExportDataOpeningTime]} openingTimesDay
 * @return [ApiDpOpeningHourOpenedTimes]
 */
function migrateOpeningHours(openingTimesDay) {
  /** @type [ApiDpOpeningHourOpenedTimes] */
  let migratedOpeningTimes = []

  if (!openingTimesDay) {
    return []
  }

  if (openingTimesDay[0].mon) {
    migratedOpeningTimes.push(...migrateOpeningHoursDay(openingTimesDay[0].mon, 0))
  }

  if (openingTimesDay[0].tue) {
    migratedOpeningTimes.push(...migrateOpeningHoursDay(openingTimesDay[0].tue, 1))
  }

  if (openingTimesDay[0].wed) {
    migratedOpeningTimes.push(...migrateOpeningHoursDay(openingTimesDay[0].wed, 2))
  }

  if (openingTimesDay[0].thu) {
    migratedOpeningTimes.push(...migrateOpeningHoursDay(openingTimesDay[0].thu, 3))
  }

  if (openingTimesDay[0].fri) {
    migratedOpeningTimes.push(...migrateOpeningHoursDay(openingTimesDay[0].fri, 4))
  }

  if (openingTimesDay[0].sat) {
    migratedOpeningTimes.push(...migrateOpeningHoursDay(openingTimesDay[0].sat, 5))
  }

  if (openingTimesDay[0].sun) {
    migratedOpeningTimes.push(...migrateOpeningHoursDay(openingTimesDay[0].sun, 6))
  }

  return migratedOpeningTimes
}

/**
 * @type Function
 * @param {ExportDataOpeningTimeDay} openingTimesDay
 * @param {number} indexDay
 * @return [ApiDpOpeningHourOpenedTimes]
 */
function migrateOpeningHoursDay(openingTimesDay, indexDay) {
  /** @type [ApiDpOpeningHourOpenedTimes] */
  let migratedDays = []

  if (!openingTimesDay) {
    return []
  }

  if (openingTimesDay[0]['first']) {
    migratedDays.push({
      weekday: indexDay,
      openTime: openingTimesDay[0]['first'].timeStart || '',
      closeTime: openingTimesDay[0]['first']['timeEnd'] || ''
    })
  }

  if (openingTimesDay[0]['second']) {
    migratedDays.push({
      weekday: indexDay,
      openTime: openingTimesDay[0]['second'].timeStart || '',
      closeTime: openingTimesDay[0]['second']['timeEnd'] || ''
    })
  }
  return migratedDays
}

/**
 * @type Function
 * @param {ExportDataDetails} details
 * @param {ApiDpPostInstitutionsDto} institution
 * @param {ApiDpLocale} locale
 * @return void
 */
function migrateDetails(details, institution, locale) {
  if (Number(details.id.replace('act', '1')) !== institution.id) {
    throw new Error(`ERROR: different IDs found: ${details.id} !== ${institution.id}`)
  }

  // name is set via basicInfo
  // address is set via basicInfo
  // city is set via basicInfo

  if (!details.address) {
    throw new Error(`ERROR: no zip available ${details.id}`)
  }
  details.address.forEach(addressItem => {
    if (addressItem.type === 'visitor') {
      if (!addressItem.place) {
        throw new Error(`ERROR: no place available ${JSON.stringify(details)} ${locale}`)
      }
      if (!institution.city) {
        institution.city = []
      }
      institution.city.push({ language: locale, text: addressItem.place })

      if (!addressItem.street) {
        throw new Error(`ERROR: no street available ${JSON.stringify(details)} ${locale}`)
      }
      if (!institution.address) {
        institution.address = []
      }
      institution.address.push({ language: locale, text: addressItem.street })

      if (!addressItem.zip) {
        throw new Error(`ERROR: no zip available ${JSON.stringify(details)} ${locale}`)
      }
      if (!institution.zipCode) {
        institution.zipCode = addressItem.zip
      }
    }
  })

  // classification -> categories migrated via basicInfo

  /** @type [ApiDpCommunication] */
  let newCommunications = []
  if (details.communication) {
    details.communication.forEach(communication => {
      switch (communication.id) {
        case 'com0022':
          newCommunications.push({ id: 0, communicationType: 'Telephone', value: communication.item })
          break
        case 'com0024':
          newCommunications.push({ id: 0, communicationType: 'Email', value: communication.item })
          break
        case 'com0001':
        case 'com0003':
        case 'com0004':
        case 'com0021':
        case 'com0023':
        case 'com0025':
        case 'com0026':
        case 'com0027':
          break
        default:
          console.error('ERROR: communication not mapped:', communication.id, communication.item, details.id)
      }
    })
  }

  /** @type [ApiDpMediaItem] */
  let videoResources = []
  /** @type [ApiDpMediaItem] */
  let audioResources = []
  /** @type [ApiDpMediaItem] */
  let livingImages = []
  if (details.webResource) {
    details.webResource.forEach(webResource => {
      switch (webResource.source_id) {
        case 'webpage':
          newCommunications.push({ id: 0, communicationType: 'Website', value: JSON.stringify({ url: webResource.identifier, label: webResource.label }) })
          break
        case 'socialMedia':
          switch (webResource.label) {
            case 'facebook':
            case 'Facebook':
              newCommunications.push({ id: 0, communicationType: 'Facebook', value: webResource.identifier })
              break
            case 'youtube':
            case 'Youtube':
            case 'YouTube':
              newCommunications.push({ id: 0, communicationType: 'Youtube', value: webResource.identifier })
              break
            case 'instagram':
            case 'instgram':
            case 'instagran':
            case 'Instagram':
              newCommunications.push({ id: 0, communicationType: 'Instagram', value: webResource.identifier })
              break
            case 'twitter':
            case 'Twitter':
              newCommunications.push({ id: 0, communicationType: 'Twitter', value: webResource.identifier })
              break
            case 'vimeo':
              newCommunications.push({ id: 0, communicationType: 'Vimeo', value: webResource.identifier })
              break
            case 'tiktok':
              newCommunications.push({ id: 0, communicationType: 'TikTok', value: webResource.identifier })
              break
            case 'phonomuseumseeholz.de':
              newCommunications.push({ id: 0, communicationType: 'Website', value: JSON.stringify({ url: webResource.identifier, label: webResource.label }) })
              break
            default:
              console.error('ERROR: social media not mapped:', webResource.label, webResource.identifier, details.id)
          }
          break
        case 'wiki':
          newCommunications.push({ id: 0, communicationType: 'Wikipedia', value: webResource.identifier })
          break
        case 'c00297':
          newCommunications.push({ id: 0, communicationType: 'EventUrl', value: webResource.identifier })
          break
        case 'c00022':
          videoResources.push(
            {
              id: 0,
              mediaType: 'Video',
              alternateText: '',
              filename: webResource.label,
              copyright: '',
              artist: '',
              order: 0
            }
          )
          break
        case 'c00123':
          audioResources.push(
            {
              id: 0,
              mediaType: 'Audio',
              alternateText: '',
              filename: webResource.label,
              copyright: '',
              artist: '',
              order: 0
            }
          )
          break
        case 'c00021':
        case 'c00023':
          newCommunications.push({ id: 0, communicationType: '3D-Rundgang', value: webResource.identifier })
          break
        case 'c00052':
          newCommunications.push({ id: 0, communicationType: 'Medienguide', value: webResource.identifier })
          break
        case 'living_images':
          livingImages.push(
            {
              id: 0,
              mediaType: 'LivingImage',
              alternateText: '',
              filename: webResource.label,
              copyright: '',
              artist: '',
              order: 0
            }
          )
          break
        case 'c00025': // Archivinformationssystem
          break
        default:
          console.error('ERROR: webResource not mapped:', webResource.source_id, webResource.label, webResource.identifier, details.id)
      }
    })
  }

  if (!institution.communications) {
    institution.communications = []
  }
  newCommunications.forEach(newCommunication => {
    if (!institution.communications.find(existingCommunication => JSON.stringify(existingCommunication) === JSON.stringify(newCommunication))) {
      institution.communications.push(newCommunication)
    }
  })

  // mapping can be ignored
  // pos is set via basicInfo

  let ksdescription = ''
  let description = ''
  let specialOpeningHours = ''
  if (details.description) {
    details.description.forEach(value => {
      switch (value.id) {
        case 'info001':
          value.noteValue.forEach(element => {
            description += element
          })
          break
        case 'info028':
          value.noteValue.forEach(element => {
            institution.nameAddition.push({ language: locale, text: element })
          })
          break
        case 'info029':
          value.noteValue.forEach(element => {
            ksdescription += element
          })
          break
        case 'info016':
        case 'info019':
          value.noteValue.forEach(element => {
            specialOpeningHours += element.endsWith('\n') ? element : element + '\n'
          })
          break
        case 'info002': // Angebote
        case 'info003':
        case 'info004': // Anfahrt PKW
        case 'info005': // Anfahrt Öffis
        case 'info007': // Parkplätze
        case 'info009': // Individuelle Angebote de
        case 'info010': // Individuelle Angebote en
        case 'info015': // Info-Materialien
        case 'info020': // Lage
        case 'info023': // Finanzierung
        case 'info026': // Kosten
        case 'info027': // Führungen
        case 'info030':
        case 'info031':
          break
        default:
          console.error('ERROR: description id not mapped:', value.id, value.noteValue, details.id)
      }
    })
  }
  institution.description = ksdescription || description || 'Es ist noch keine Beschreibung vorhanden.'
  institution.specialOpeningHours = specialOpeningHours

  // icon set via basicInfo

  /** @type [ApiDpMediaItem] */
  let imageResources = []
  if (details.resource) {
    details.resource.forEach(resource => {
      if (resource.type === 'image') {
        if (resource.resourceRepresentation) {
          resource.resourceRepresentation.forEach(image => {
            if (image.type === 'provided_image') {
              if (!institution.media?.some(media => { return media.filename === image.link })) {
                imageResources.push(
                  {
                    id: 0,
                    mediaType: 'Image',
                    alternateText: resource.title + (resource.description ? ' - ' + resource.description : ''),
                    filename: image.link,
                    copyright: (resource.rightsType ? resource.rightsType + ' - ' : '') + resource.rightsHolder,
                    artist: resource.photographer,
                    order: 0
                  }
                )
              }
            }
          })
        } else {
          console.error('ERROR: image without resourceRepresentation:', resource)
        }
      }
    })
  }

  if (details.openingTimes) {
    if (!institution.openingHours) {
      institution.openingHours = []
    }
    institution.openingHours.push({
      id: 0,
      activeStartDate: '',
      activeEndDate: '',
      priority: true,
      visible: true,
      isEveryYear: false,
      comment: [],
      openedTimes: migrateOpeningHours(details.openingTimes)
    })
  }

  if (Object.prototype.toString.call(details.closedHolidays) === '[object Array]') {
    if (!institution.specialClosedDays) {
      institution.specialClosedDays = []
    }
    details.closedHolidays.forEach(closedHoliday => {
      institution.specialClosedDays.push({
        language: locale,
        text: closedHoliday.name
      })
    })
  }

  // recordMetadataDate not necessary

  if (!institution.media) {
    institution.media = []
  }
  institution.media.push(...imageResources)
  institution.media.push(...videoResources)
  institution.media.push(...audioResources)
  institution.media.push(...livingImages)

  institution.media.map((mediaItem, index) => {
    mediaItem.order = index
  })

  // TODO keep Media Order
}

/** @type Promise[ApiDpPostInstitutionsDto] */
const importData = []
/** @type [ApiDpTag] */
const tags = []
/** @type [ApiDpCategory] */
const categories = []

/** @type {[string]} */
const tagsUnknown = []
/** @type {[string]} */
const tagsNotInNewApiAvailable = []
/** @type {[string]} */
const categoriesUnknown = []
/** @type {[string]} */
const categoriesNotInNewApiAvailable = []

const promiseTags = fetch('https://kulturfinder.bremen.de/api/Tag/GetTags')
  .then(response => {
    return response.json()
  })
  .then(json => {
    tags.push(...json)
    return true
  })

const promiseCategories = fetch('https://kulturfinder.bremen.de/api/Category/GetCategories')
  .then(response => {
    return response.json()
  })
  .then(json => {
    categories.push(...json)
    return true
  })

Promise.all([promiseTags, promiseCategories])
  .then(() => {
    if (!tags || !categories) {
      throw new Error(`ERROR: Tags or Categories not set`)
    }

    exportData.map(/** @type {ExportDataItem} */ data => {
    /** @type ApiDpPostInstitutionsDto */
      let institution = {}

      if (!data.actId) {
        throw new Error('ERROR: no actor Id in exported data')
      }
      institution.id = Number(data.actId.replace('act', '1'))

      migrateBasicInformation(data.de.basicInfo, institution, 'de')
      migrateBasicInformation(data.en.basicInfo, institution, 'en')
      migrateBasicInformation(data.da.basicInfo, institution, 'da')

      migrateDetails(data.de.details, institution, 'de')
      migrateDetails(data.en.details, institution, 'en')
      migrateDetails(data.da.details, institution, 'da')

      importData.push(institution)
    })

    if (tagsUnknown) {
      console.error(`ERROR: Tag not found. Icon id = ${JSON.stringify(tagsUnknown)}`)
    }
    if (tagsNotInNewApiAvailable) {
      console.error(`ERROR: Tag not available in new API. Icon id = ${JSON.stringify(tagsNotInNewApiAvailable)}`)
    }
    if (categoriesUnknown) {
      console.error(`ERROR: Category not found. Icon id = ${JSON.stringify(categoriesUnknown)}`)
    }
    if (categoriesNotInNewApiAvailable) {
      console.error(`ERROR: Category not available in new API. Icon id = ${JSON.stringify(categoriesNotInNewApiAvailable)}`)
    }

    console.log(`DONE. Migrated ${importData.length} institutions`)
  })
  .then(() => {
    fs.writeFile(`./data-migration/output/import_data.json`, JSON.stringify(importData), err => {
      if (err) {
        console.error('ERROR: ', err)
      } else {
        console.log(`File written`)
      }
    })
  })
