/** @typedef MediaMapItem
 * @property {string} filename
 * @property {string} path=
 */

const https = require('https')
const { pipeline } = require('stream')
const fs = require('fs')

/** @type {[ApiDpPostInstitutionsDto]} */
const importData = require('./output/import_data.json')

const mediaMapFileName = './data-migration/output/media_map_data.json'
const mediaDirectory = './data-migration/output/media/'
/** @type [MediaMapItem] */
let tempMediaMap = []

async function fetchMediaAndExport() {
  /** @type [MediaMapItem] */
  let mediaMapData = []
  if (fs.existsSync(mediaMapFileName)) {
    mediaMapData = JSON.parse(fs.readFileSync(mediaMapFileName, 'utf8'))
    console.log('LOG: loaded mediaMap')
  } else {
    console.warn('WARN: mediaMap not existing')
  }

  if (!fs.existsSync(mediaDirectory)) {
    fs.mkdirSync(mediaDirectory, { recursive: true })
  }

  importData.forEach(item => {
    item.media.forEach(mediaItem => {
      tempMediaMap.push({ filename: mediaItem.filename })
    })
  })

  if (tempMediaMap.length === mediaMapData.length) {
    tempMediaMap = mediaMapData
    console.log('LOG: lengths of maps identical - using loaded map')
  }

  for (let [index, item] of tempMediaMap.entries()) {
    if (item.path) {
      if (fs.existsSync(item.path)) {
        continue
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500))

    if (item.filename === 'Maggo Test') {
      console.warn(`WARN: 'Maggo Test`)
      continue
    }

    https.get(item.filename, (res) => {
      switch (res.statusCode) {
        case 200:
          break
        case 301:
        case 400:
          console.warn(`WARN: status code is ${res.statusCode} on ${item.filename}`)
          break
        default:
          throw new Error(`Failed to get '${item.filename}' (${res.statusCode})`)
      }

      if (res.headers['content-type'] === 'image/jpeg') {
        let localFileName = mediaDirectory + item.filename.split('/').pop() + '.jpeg'

        const fileWriteStream = fs.createWriteStream(localFileName)

        pipeline(
          res,
          fileWriteStream,
          (err) => {
            if (err) {
              throw new Error(`Pipeline failed: ${err}`)
            } else {
              item.path = localFileName
              fs.writeFile(mediaMapFileName, JSON.stringify(tempMediaMap), err => {
                if (err) {
                  throw new Error(`ERROR: ${err}`)
                } else {
                  console.info(`LOG: ${index + 1} of ${tempMediaMap.length} - ${item.filename}`)
                }
              })
            }
          }
        )
      }

      if (res.headers['content-type'] === 'image/png') {
        let localFileName = mediaDirectory + item.filename.split('/').pop() + '.png'

        const fileWriteStream = fs.createWriteStream(localFileName)

        pipeline(
          res,
          fileWriteStream,
          (err) => {
            if (err) {
              throw new Error(`Pipeline failed: ${err}`)
            } else {
              item.path = localFileName
              fs.writeFile(mediaMapFileName, JSON.stringify(tempMediaMap), err => {
                if (err) {
                  throw new Error(`ERROR: ${err}`)
                } else {
                  console.info(`LOG: ${index + 1} of ${tempMediaMap.length} - ${item.filename}`)
                }
              })
            }
          }
        )
      }
    }).on('error', (err) => {
      throw new Error(`ERROR: ${err}`)
    })
  }
}

fetchMediaAndExport().then(_ => {})
