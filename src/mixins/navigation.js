export default {
  computed: {
    getGoogleMapsLink() {
      return (street, place) => {
        /* http://maps.apple.com/?daddr=San+Francisco,+CA&saddr=cupertino oder maps:q=XX,XX (letzteres iOS only) wäre das URI Template für Apple Karten */
        /* geo:q=37.6894694,-121.000303(The Name You Want To Show) ist für Android only - Google Maps App wird geöffnet */
        if (street === '' || place === '') return '#'
        const urlBase = 'https://www.google.com/maps/dir/?api=1&destination='
        return urlBase + encodeURI(street + ', ' + place)
      }
    }
  }
}
