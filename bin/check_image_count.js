const fetch = require('node-fetch')

const digiCultUrl = 'https://kultursphaere.sh/corsproxy.php?url=http://xtree-actor-api.digicult-verbund.de'
const locale = 'de';

(async () => {
  console.log('fetching...')

  const response = await fetch(`${digiCultUrl}/getRepositoryList?portalURI=http://digicult.vocnet.org/portal/p0287&count=9999&lang=${locale}`)
  const data = await response.json()

  console.log(`fetched ${data.Actor.length} institutions.`)

  for (let i = 0; i < data.Actor.length; i++) {
    let institution = data.Actor[i]

    try {
      const response = await fetch(`${digiCultUrl}/getRepositoryItem?id=${institution.id}&lang=${locale}`)
      const data = await response.json()

      institution = data.Actor

      institution.name = institution.name.find(item => item.role === 'preferred')
      if (institution.name.nameAddition) {
        institution.name = institution.name.nameAddition
      } else if (institution.name.label) {
        institution.name = institution.name.label
      } else {
        institution.name = 'Unbekannter Name'
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

        if (institution.images.length < 2) {
          console.log(`${institution.id};${institution.name};${institution.images.length}`)
        }
      }
    } catch (error) {
      console.log(`error fetching details for ${institution.id};${institution.name}: ${error}`)
    }
  }
})()
