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

  let responseBody = await response.json()

  return responseBody.Actor
}

async function fetchDataAndExport() {
  let allInstitutionsDetails = []

  const responseDE = await fetch(`${URL}/getRepositoryList?portalURI=http://digicult.vocnet.org/portal/p0287&count=9999&lang=de`)
  const responseEN = await fetch(`${URL}/getRepositoryList?portalURI=http://digicult.vocnet.org/portal/p0287&count=9999&lang=en`)
  const responseDA = await fetch(`${URL}/getRepositoryList?portalURI=http://digicult.vocnet.org/portal/p0287&count=9999&lang=da`)

  const responseBodyDE = await responseDE.json()
  const responseBodyEN = await responseEN.json()
  const responseBodyDA = await responseDA.json()

  allInstitutionsDetails = responseBodyDE.Actor.map( entry => {return {actId: entry.id, de: {}, en: {}, da:{}}} )

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

fetchDataAndExport().then(r => console.log('DONE'))
