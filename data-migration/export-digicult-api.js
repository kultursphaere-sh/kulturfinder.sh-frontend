/** @typedef {[ExportDataItem]} ExportData
 */

/** @typedef ExportDataItem
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
 * @property {[ExportDataOpeningTime]} openingTimes
 * @property {[ExportDataClosedHoliday]} closedHolidays
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

/** @typedef ExportDataOpeningTime
 * @property {ExportDataOpeningTimeDay=} mon
 * @property {ExportDataOpeningTimeDay=} tue
 * @property {ExportDataOpeningTimeDay=} wed
 * @property {ExportDataOpeningTimeDay=} thu
 * @property {ExportDataOpeningTimeDay=} fri
 * @property {ExportDataOpeningTimeDay=} sat
 * @property {ExportDataOpeningTimeDay=} sun
 */

/** @typedef ExportDataOpeningTimeDay
 * @property {ExportDataOpeningTimeSlot} first
 * @property {ExportDataOpeningTimeSlot} second
 */

/** @typedef ExportDataOpeningTimeSlot
 * @property {string} timeStart
 * @property {string} timeEnd
 */

/** @typedef ExportDataClosedHoliday
 * @property {string} id
 * @property {string} name
 */

const fetch = require('node-fetch')
const fs = require('fs')
const URL = 'https://kultursphaere.sh/corsproxy.php?url=http://xtree-actor-api.digicult-verbund.de'

async function fetchDetails(actorId, locale) {
  await new Promise(resolve => setTimeout(resolve, 500))

  let response = await fetch(`${URL}/getRepositoryItem?id=${actorId}&lang=${locale}`)

  if (!response.ok) {
    response = await fetch(`${URL}/getRepositoryItem?info030=${actorId}&lang=${locale}`)
  }

  if (!response.ok) {
    console.error('Error in fetch for Details: ' + response)
  }

  /** @type {{Actor: any}} */
  let responseBody = await response.json()

  return responseBody.Actor
}

async function fetchDataAndExport() {
  const responseDE = await fetch(`${URL}/getRepositoryList?portalURI=http://digicult.vocnet.org/portal/p0287&count=9999&lang=de`)
  const responseEN = await fetch(`${URL}/getRepositoryList?portalURI=http://digicult.vocnet.org/portal/p0287&count=9999&lang=en`)
  const responseDA = await fetch(`${URL}/getRepositoryList?portalURI=http://digicult.vocnet.org/portal/p0287&count=9999&lang=da`)

  const responseBodyDE = await responseDE.json()
  const responseBodyEN = await responseEN.json()
  const responseBodyDA = await responseDA.json()

  let allInstitutionsDetails = responseBodyDE.Actor.map(entry => { return { actId: entry.id, de: {}, en: {}, da: {} } })

  for (let institution of allInstitutionsDetails) {
    responseBodyDE.Actor.forEach((response) => {
      if (institution.actId === response.id) {
        institution.de.basicInfo = response
      }
    })

    responseBodyEN.Actor.forEach((response) => {
      if (institution.actId === response.id) {
        institution.en.basicInfo = response
      }
    })

    responseBodyDA.Actor.forEach((response) => {
      if (institution.actId === response.id) {
        institution.da.basicInfo = response
      }
    })

    institution.de.details = await fetchDetails(institution.actId, 'de')
    institution.en.details = await fetchDetails(institution.actId, 'en')
    institution.da.details = await fetchDetails(institution.actId, 'da')

    console.log('In progress... exported institution:', institution.actId)
  }

  const filename = `./data-migration/output/export_data.json`
  await fs.writeFile(filename, JSON.stringify(allInstitutionsDetails), _ => {})
}

fetchDataAndExport().then(_ => console.log('DONE'))
