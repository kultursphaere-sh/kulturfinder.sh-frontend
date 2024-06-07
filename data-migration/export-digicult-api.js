const fetch = require('node-fetch')
const fs = require('fs').promises
const URL = 'https://kultursphaere.sh/corsproxy.php?url=http://xtree-actor-api.digicult-verbund.de'
const locales = ['de', 'da', 'en']

let localeFiles = {
  de: require('../src/locales/de.json'),
  en: require('../src/locales/en.json'),
  da: require('../src/locales/da.json')
}

function migrateBasicInformation(actorObj) {
  let institution = {}

  if (actorObj.id) {
    institution.id = actorObj.id
  }

  if (actorObj.name) {
    institution.name = actorObj.name
  }

  // TODO name addition, teaser

  if (actorObj.place) {
    institution.place = actorObj.place
  }

  if (actorObj.street) {
    institution.street = actorObj.street
  }

  if (actorObj.pos) {
    const lat = actorObj.pos.split(' ')[1]
    const lng = actorObj.pos.split(' ')[0]
    institution.position = {
      lat: lat,
      lng: lng
    }
  }

  if (actorObj.teaser) {
    institution.teaser = actorObj.teaser
  }

  return institution
}

function migrateIconsIntoTags(iconsArray, locale, actorId) {
  let tags = []
  iconsArray.forEach(icon => {
    const text = localeFiles[locale].tags[icon.id]
    if (text) {
      tags.push(text)
    } else {
      console.error(`ERROR: Tag not found. Icon id = ${icon.id} Actor id = ${actorId}`)
    }
    tags.push()
  })
  return tags
}

function migrateClassificationsToCategories(classificationsArray, locale, actorId) {
  let categories = []
  classificationsArray.forEach(classification => {
    if (classification.type === 'tourismustyp') {
      let categoryId = classification.uri.replace('http://digicult.vocnet.org/portal/', '')
      let categoryText = localeFiles[locale].categories['http://digicult']['vocnet'][`org/portal/${categoryId}`]
      if (categoryText) {
        categories.push(categoryText)
      } else {
        console.error(`ERROR: Category not found. Classification = ${JSON.stringify(classification)} Actor id = https://kulturfinder.sh/de/institutions/dashboard/details/${actorId}`)
      }
    }
  })
  return categories
}

function migrateDetails(body, locale, actorId) {
  if (!body.Actor) {
    throw new Error('ERROR: fetching details - no actor found')
  }
  if (body.Actor.id !== actorId) {
    throw new Error('ERROR: fetching details - wrong actor id')
  }
  const actor = body.Actor

  let details = {}

  details.address = actor.address

  details.communications = []
  if (actor.communication) {
    actor.communication.forEach(communication => {
      switch (communication.id) {
        case 'com0022':
          details.communications.push({ communicationType: 'Telephone', value: communication.item })
          break
        case 'com0024':
          details.communications.push({ communicationType: 'Email', value: communication.item })
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
          console.error('ERROR: communication not mapped:', communication.id, communication.item, actor.id)
      }
    })
  }

  let ksdescription = ''
  let description = ''
  let specialOpeningHours = ''
  if (actor.description) {
    actor.description.forEach(value => {
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
          console.error('ERROR: description id not mapped:', value.id, value.noteValue, actor.id)
      }
    })
    details.description = ksdescription || description || 'Es ist noch keine Beschreibung vorhanden.'
    details.specialOpeningHours = specialOpeningHours
  }

  let videoResources = []
  let audioResources = []
  let livingImages = []
  if (actor.webResource) {
    actor.webResource.forEach(webResource => {
      switch (webResource.source_id) {
        case 'webpage':
          details.communications.push({ communicationType: 'Website', value: { url: webResource.identifier, label: webResource.label } })
          break
        case 'socialMedia':
          switch (webResource.label) {
            case 'facebook':
            case 'Facebook':
              details.communications.push({ communicationType: 'Facebook', value: webResource.identifier })
              break
            case 'youtube':
            case 'Youtube':
            case 'YouTube':
              details.communications.push({ communicationType: 'Youtube', value: webResource.identifier })
              break
            case 'instagram':
            case 'instgram':
            case 'instagran':
            case 'Instagram':
              details.communications.push({ communicationType: 'Instagram', value: webResource.identifier })
              break
            case 'twitter':
            case 'Twitter':
              details.communications.push({ communicationType: 'Twitter', value: webResource.identifier })
              break
            case 'vimeo':
              details.communications.push({ communicationType: 'Vimeo', value: webResource.identifier })
              break
            case 'tiktok':
              details.communications.push({ communicationType: 'TikTok', value: webResource.identifier })
              break
            case 'phonomuseumseeholz.de':
              details.communications.push({ communicationType: 'Website', value: { url: webResource.identifier, label: webResource.label } })
              break
            default:
              console.error('ERROR: social media not mapped:', webResource.label, webResource.identifier, actor.id)
          }
          break
        case 'wiki':
          details.communications.push({ communicationType: 'Wikipedia', value: webResource.identifier })
          break
        case 'c00297':
          details.communications.push({ communicationType: 'EventUrl', value: webResource.identifier })
          break
        case 'c00022':
          videoResources.push(webResource)
          break
        case 'c00123':
          audioResources.push(webResource)
          break
        case 'c00021':
        case 'c00023':
          details.communications.push({ communicationType: '3D-Rundgang', value: webResource.identifier })
          break
        case 'c00052':
          details.communications.push({ communicationType: 'Medienguide', value: webResource.identifier })
          break
        case 'living_images':
          livingImages.push(webResource)
          break
        case 'c00025': // Archivinformationssystem
          break
        default:
          console.error('ERROR: webResource not mapped:', webResource.source_id, webResource.label, webResource.identifier, actor.id)
      }
    })
  }


  return details
}

async function fetchDataAndExport(locale) {
  let allInstitutionsDetails = []
  const response = await fetch(`${URL}/getRepositoryList?portalURI=http://digicult.vocnet.org/portal/p0287&count=9999&lang=${locale}`)
  const responseBody = await response.json()

  for (const actor of responseBody.Actor) {
    await new Promise(resolve => setTimeout(resolve, 500))
    let institution = migrateBasicInformation(actor)

    if (actor?.icon) {
      institution.tags = migrateIconsIntoTags(actor.icon, locale, actor.id)
    }

    if (actor.classification.length !== 0) {
      institution.categories = migrateClassificationsToCategories(actor.classification, locale, actor.id)
    }

    // TODO restliche Arrays (Resources, links)

    let response = await fetch(`${URL}/getRepositoryItem?id=${actor.id}&lang=${locale}`)
    if (!response.ok) {
      response = fetch(`${URL}/getRepositoryItem?info030=${actor.id}&lang=${locale}`)
    }
    if (!response.ok) {
      console.error('Error in fetch for Details: ' + response)
    }

    const responseBody = await response.json()
    let details = migrateDetails(responseBody, locale, actor.id)
  }
  /*
  // After collecting all details, export them into a single JSON file for the current locale
  const filename = `institutions_details_${locale}.json`
  await fs.writeFile(filename, JSON.stringify(allInstitutionsDetails, null, 2))
  console.log(`Exported details for all institutions to file: ${filename}`)

   */
}

locales.forEach(locale => {
  fetchDataAndExport(locale).then(r => console.log(r))
})
