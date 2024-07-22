const readline = require('readline-sync')
/** @type [ApiDpPostInstitutionsDto] */
const importData = require('./output/import_data.json')
const mediaMapData = require('./output/media_map_data.json')
const fetch = require('node-fetch')
const fs = require('fs')

/**
 * @type Function
 * @param {ApiDpPostInstitutionsDto} institution
 * @return {Promise<void>}
 */
async function upload(institution) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  const headers = new Headers()
  headers.append('Authorization', `Bearer ${apiToken}`)
  headers.append('Content-Type', 'text/json')

  console.log('DATA ', institution)
  console.log('JSON ', JSON.stringify(institution))

  const response = await fetch(`${apiUrl}/Institute/AddInstitute`, {
    method: 'POST',
    headers: headers,
    body: {
      data: JSON.stringify(institution)
    }
  })

  console.log(response)
}

// TODO set id to 0
// TODO translate description
// TODO migrate telephone + test (+49000000000)
// TODO translate specialOpeninHours
// TODO fix openingHours
// TODO migrate media

// AUTH
let apiUrl = readline.question('Api-Url: ') || 'https://localhost:7262'
let apiToken = readline.question('API-Token: ') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjE2ODMwNDd9.ItQGOgv_dImhxXi09cFMrNLjI6tKRZvMr-yoRjHIGYA'

console.log(`Api-Url: ${apiUrl}`)

let temp = importData[0]
temp.id = 0
temp.media = []
temp.specialOpeningHours = []
temp.communications = []
temp.openingHours = []
temp.description = undefined
temp.region = {
  id: 0,
  state: 'Schleswig_Holstein',
  name: [
    {
      language: 'en',
      text: 'Schleswig'
    }
  ]
}

upload(temp).then()

/*

for (let institution of importData) {
  // TODO merge media map and institution data

  upload(institution).then()
}

 */
