const locales = ['de', 'da', 'en']
const exportData = require('./output/export_data.json')
/** @type [Tag] */
const tags = require('./tags.json')
/** @type [Category] */
const categories = require('./categories.json')
const fs = require("fs");
const localeFiles = {
  de: require('../src/locales/de.json'),
  en: require('../src/locales/en.json'),
  da: require('../src/locales/da.json')
}

/** @typedef {'de' | 'en' | 'da'}  Locale
 */

/** @typedef ExportData
 * @property {string} actId
 * @property {ExportDataTranslation} de
 * @property {ExportDataTranslation} en
 * @property {ExportDataTranslation} da
 */

/** @typedef ExportDataTranslation
 * @property {ExportDataBasicInfo} basicInfo
 * @property {ExportDataDetails} details
 */

/** @typedef ExportDataBasicInfo
 * @property {string} id
 * @property {string} name
 * @property {string} place
 * @property {string} street
 * @property {string} pos
 * @property {string} teaser
 * @property {[ExportDataIcon]} icon
 * @property {[ExportDataClassification]} classification
 */

/** @typedef ExportDataIcon
 * @property {string} type
 * @property {string} id
 */

/** @typedef ExportDataClassification
 * @property {string} type
 * @property {string} uri
 */

/** @typedef ExportDataWebResource
 * @property {string} source_id
 * @property {string} type
 * @property {string} identifier
 * @property {string} label
 */

/** @typedef ExportDataDetails
 * @property {string} id
 * @property {[]} name
 * @property {[]} address
 * @property {[ExportDataClassification]} classification
 * @property {[ExportDataCommunication]} communication
 * @property {[ExportDataWebResource]} webResource
 * @property {[ExportDataDescription]} description
 * @property {[ExportDataResource]} resource
 */

/** @typedef ExportDataCommunication
 * @property {string} id
 * @property {string} item
 */

/** @typedef ExportDataDescription
 * @property {string} id
 * @property {[string]} noteValue
 */

/** @typedef ExportDataResource
 * @property {[ExportDataResourceRepresentation]} resourceRepresentation
 * @property {string} type
 * @property {string} rightsHolder
 * @property {string} rightsType
 * @property {string} photographer
 * @property {string} title
 * @property {string} description
 * @property {string} tag
 */

/** @typedef ExportDataResourceRepresentation
 * @property {string} type
 * @property {string} link
 */

/** @typedef Translation
 * @property {string} language
 * @property {string} text
 */

/** @typedef Tag
 * @property {number} id
 * @property {Translation} text
 */

/** @typedef Category
 * @property {number} id
 * @property {Translation} name
 */

/** @typedef Communication
 * @property {number} id
 * @property {string} communicationType
 * @property {string} value
 */

/** @typedef Media
 * @property {number} id
 * @property {string} mediaType
 * @property {string} alternateText
 * @property {string} filename
 * @property {string} copyright
 * @property {string} artist
 * @property {number} order
 */

/** @typedef InstitutionsDtoElement
 * @property {number} id
 * @property {[Category]} categories
 * @property {[Tag]} tags
 * @property {[Communication]} communications
 * @property {[Media]} media
 * @property {Array.<{id: number, activeStartDate: string, activeEndDate: string, priority: boolean,
 * isEveryYear: boolean, comment: string, openedTimes: Array.<{weekday: number, openTime: string, closeTime: string}>,
 * closedDays: Array.<{date: string, text: string, isEveryYear: boolean}>}>} openingHours
 * @property {Array.<{date: string, text: string, isEveryYear: boolean}>} closedDays
 * @property {string} specialOpeningHours
 * @property {string} specialClosedDays
 * @property {boolean} visible
 * @property {string} dataRights
 * @property {string} workingState
 * @property {Array.<Translation>} name
 * @property {Array.<Translation>} nameAddition
 * @property {string} description
 * @property {id: number, state: string, name: string} region
 * @property {Array.<Translation>} address
 * @property {string} name_c_o
 * @property {string} zipCode
 * @property {Array.<Translation>} city
 * @property {string} latitude
 * @property {string} longitude
 * @property {boolean} hasLivingImages
 */

/** @typedef InstitutionsDto
 * @type Array.<InstitutionsDtoElement>
 */

/**
 * @type Function
 * @param {[ExportDataIcon]} iconsArray
 * @param {Locale} locale
 * @param {string} actorId
 * @return {[Tag]}
 */
function migrateIconsIntoTags(iconsArray, locale, actorId) {
  /** @type [Tag] */
  let migratedTags = []
  iconsArray.forEach(icon => {
    const iconText = localeFiles[locale].tags[icon.id]
    if (!iconText) {
      console.error(`ERROR: Tag not found. Icon id = ${icon.id} Actor id = ${actorId}`)
    } else {
      const availableTag = tags.find(tag => {
        return tag.text.find(tagText => { return tagText.text === iconText })
      })
      if (availableTag) {
        migratedTags.push(availableTag)
      } else {
        console.error(`ERROR: Tag not mapped. Locale = ${locale} Icon id = ${iconText} Actor id = ${actorId}`)
      }
    }
  })
  return migratedTags
}

/**
 * @type Function
 * @param {[ExportDataClassification]} classificationsArray
 * @param {Locale} locale
 * @param {string} actorId
 * @return {[Category]}
 */
function migrateClassificationsToCategories(classificationsArray, locale, actorId) {
  let migratedCategories = []
  classificationsArray.forEach(classification => {
    if (classification.type === 'tourismustyp') {
      let classificationId = classification.uri.replace('http://digicult.vocnet.org/portal/', '')
      let classificationText = localeFiles[locale].categories['http://digicult']['vocnet'][`org/portal/${classificationId}`]
      if (!classificationText) {
        console.error(`ERROR: Category not found. Classification = ${JSON.stringify(classification)} Actor id = https://kulturfinder.sh/de/institutions/dashboard/details/${actorId}`)
      } else {
        const availableCategory = categories.find(category => {
          return category.name.find(categoryName => { return categoryName.text === classificationText })
        })
        if (availableCategory) {
          migratedCategories.push(availableCategory)
        } else {
          console.error(`ERROR: Category not mapped. Locale = ${locale} Icon id = ${classificationText} Actor id = ${actorId}`)
        }
      }
    }
  })
  return migratedCategories
}

/**
 * @type Function
 * @param {ExportDataBasicInfo} basicInfo
 * @param {InstitutionsDtoElement} institution
 * @param {Locale} locale
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

  if (!basicInfo.place) {
    throw new Error(`ERROR: no place available ${JSON.stringify(basicInfo)} ${locale}`)
  }
  if (!institution.city) {
    institution.city = []
  }
  institution.city.push({ language: locale, text: basicInfo.place })

  if (!basicInfo.street) {
    throw new Error(`ERROR: no street available ${JSON.stringify(basicInfo)} ${locale}`)
  }
  if (!institution.address) {
    institution.address = []
  }
  institution.address.push({ language: locale, text: basicInfo.street })

  if (!basicInfo.pos) {
    throw new Error(`ERROR: no pos available ${JSON.stringify(basicInfo)} ${locale}`)
  }
  if (!institution.latitude || !institution.longitude) {
    institution.latitude = basicInfo.pos.split(' ')[1]
    institution.longitude = basicInfo.pos.split(' ')[0]
  }

  if (!basicInfo.teaser) {
    console.error(`ERROR: no teaser available ${basicInfo.id} ${basicInfo.name} ${locale}`)
  } else {
    if (!institution.nameAddition) {
      institution.nameAddition = []
    }
    institution.nameAddition.push({ language: locale, text: basicInfo.teaser })
  }

  if (!basicInfo.icon) {
    console.error(`ERROR: no icon available ${basicInfo.id} ${basicInfo.name} ${locale}`)
  } else {
    if (!institution.tags) {
      institution.tags = []
    }
    migrateIconsIntoTags(basicInfo.icon, locale, basicInfo.id).forEach(newTag => {
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
 * @param {ExportDataDetails} details
 * @param {InstitutionsDtoElement} institution
 * @param {Locale} locale
 */
function migrateDetails(details, institution, locale) {
  if (Number(details.id.replace('act', '1')) !== institution.id) {
    throw new Error(`ERROR: different IDs found: ${details.id} !== ${institution.id}`)
  }

  // name is set via basicInfo
  // address is set via basicInfo
  // city is set via basicInfo

  if (!details.address[0].zip) {
    throw new Error(`ERROR: no zip available ${details.id}`)
  }
  if (details.address.length > 1) {
    throw new Error(`ERROR: more than one address available ${details.id}`)
  }
  institution.zipCode = details.address[0].zip

  // classification -> categories migrated via basicInfo

  /** @type [Communication] */
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

  /** @type [Media] */
  let videoResources = []
  /** @type [Media] */
  let audioResources = []
  /** @type [Media] */
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
        case 'info028':
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

  /** @type [Media] */
  let imageResources = []
  if (details.resource) {
    details.resource.forEach(resource => {
      if (resource.type === 'image') {
        if (resource.resourceRepresentation) {
          resource.resourceRepresentation.forEach(image => {
            if (image.type === 'provided_image') {
              imageResources.push(
                {
                  id: 0,
                  mediaType: 'Image',
                  alternateText: resource.title + (resource.description ? ' - ' + resource.description : ''),
                  filename: resource.link,
                  copyright: (resource.rightsType ? resource.rightsType + ' - ' : '') + resource.rightsHolder,
                  artist: resource.photographer,
                  order: 0
                }
              )
            }
          })
        } else {
          console.error('ERROR: image without resourceRepresentation:', resource)
        }
      }
    })
  }

  // TODO OpeningTimes
  // TODO ClosedHolidays
  // TODO jsDoc types as file on root dir

  // recordMetadataDate not necessary

  console.log(institution)
  throw new Error('break')

  // TODO in details:  teaser
  // TODO keep Media Order
  /*
  details.media = []
  videoResources.forEach(resource => {
    if (resource.type === 'URL') {
      details.media.push({
        mediaType: 'Video',
        link: resource.label
      })
    } else {
      console.error('ERROR: video without type=URL', resource)
    }
  })

  audioResources.forEach(resource => {
    console.log(resource)
  })
  */
}

/** @type InstitutionsDto */
let importData = []

for (/** @type {ExportData} */ let data of exportData) {
  /** @type InstitutionsDtoElement */
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
}

const filename = `./data-migration/output/import_data.json`
await fs.writeFile(filename, JSON.stringify(importData), _ => {})
