const fetch = require('node-fetch');
const fs = require('fs').promises;
const URL = 'https://kultursphaere.sh/corsproxy.php?url=http://xtree-actor-api.digicult-verbund.de';
const locales = ['de', 'da', 'en'];

const tagDefinitions = {
  "opt001": {
    "de": "Kostenfrei",
    "en": "Free of charge",
    "da": "Gratis",
  },
  "opt004": {
    "de": "Parkplatz",
    "en": "Parking available",
    "da": "Parkering tilgængelig",
  },
  "opt006": {
    "de": "Regelmäßige Führungen",
    "en": "Regular tours",
    "da": "Regelmæssige rundvisninger",
  },
  "opt012": {
    "de": "Angebot für Sehbehinderte",
    "en": "Offers for the visually impaired",
    "da": "Tilbud for synshæmmede",
  },
  "opt013": {
    "de": "Angebot für Hörbehinderte",
    "en": "Offers for the hearing impaired",
    "da": "Tilbud for hørehæmmede",
  },
  "opt017": {
    "de": "Barrierefrei zugänglich",
    "en": "Wheelchair accessible",
    "da": "Kørestolsadgang",
  },
  "opt020": {
    "de": "Behindertenparkplatz",
    "en": "Disabled parking",
    "da": "Handicapparkering",
  },
  "opt021": {
    "de": "Shop",
    "en": "Shop",
    "da": "Butik",
  },
  "opt022": {
    "de": "Gastronomie",
    "en": "Catering services",
    "da": "Gastronomi",
  },
  "opt024": {
    "de": "Behinderten-WC",
    "en": "Accessible toilet",
    "da": "Handicaptoilet",
  },
  "opt033": {
    "de": "Familienfreundlich",
    "en": "Family-friendly",
    "da": "Børnevenlig",
  },
  "opt035": {
    "de": "Angebot für Schulklassen",
    "en": "Offers for school classes",
    "da": "Tilbud for skoleklasser",
  },
  "opt036": {
    "de": "Schietwetter Angebote",
    "en": "Activities for bad weather",
    "da": "Aktiviteter for dårligt vejr",
  },
  "opt037": {
    "de": "Open Air",
    "en": "Open air",
    "da": "Friluft",
  },
  "opt039": {
    "de": "MuseumsCard",
    "en": "Museums card",
    "da": "Museumskort",
  },
  "opt041": {
    "de": "Videoclips verfügbar",
    "en": "Video clips available",
    "da": "Videoklip tilgængelige",
  },
  "optlang_en": {
    "de": "Angebot auf Englisch",
    "en": "Offerings in English",
    "da": "Tilbud på engelsk",
  },
  "optlang_da": {
    "de": "Angebot auf Dänisch",
    "en": "Offerings in Danish",
    "da": "Tilbud på dansk",
  },
  "opt032": {
    "de": "Kinder/Jugendliche",
    "en": "Children/Teenagers",
    "da": "Børn/Unge"
  },

  "opt034": {
    "de": "Senioren",
    "en": "Seniors",
    "da": "Seniorer"
  },

  "opt018": {
    "de": "Rollstuhlzugänglichkeit",
    "en": "Wheelchair accessibility",
    "da": "Kørestolsadgang"
  }
  // Fügen Sie hier bei Bedarf weitere Tags hinzu...
};

locales.forEach(locale => {
  const fetchDataAndExport = async () => {
    try {
      // Fetch-Anfrage
      const response = await fetch(`${URL}/getRepositoryList?portalURI=http://digicult.vocnet.org/portal/p0287&count=9999&lang=${locale}`);
      const responseBody = await response.json();
      console.log(`Fetched data for locale ${locale}:`, JSON.stringify(responseBody, null, 2));
      console.log(`Fetched data for locale ${locale}:`, responseBody);

      // Erstellen der Daten unter Beibehaltung der Original-IDs
      const data = responseBody.Actor.map((actor, index) => {
        // Tags übersetzen, falls verfügbar, sonst Original-ID verwenden
        const tags = Array.isArray(actor.icon) ? actor.icon.map(icon =>
          tagDefinitions[icon.id] && tagDefinitions[icon.id][locale] ? tagDefinitions[icon.id][locale] : icon.id
        ) : [];

        // Die restlichen Actor Eigenschaften einbeziehen
        return {
          id: actor.id, // Beibehaltung der ursprünglichen ID
          name: actor.name,
          nameAddition: actor.nameAddition,
          place: actor.place,
          street: actor.street,
          ISIL: actor.ISIL,
          pos: actor.pos,
          teaser: actor.teaser,
          tags: tags, // Hier werden die übersetzten oder originalen Tags verwendet
          icon: actor.icon, // Direktes Einbeziehen ohne Modifikation
          classification: actor.classification, // Auch direkt einbezogen
          resource: actor.resource,
          links: actor.links
        };
      });

      // Datenstruktur in eine JSON-Datei schreiben
      await fs.writeFile(`./data_${locale}.json`, JSON.stringify(data, null, 2));
      console.log(`Data has been written to file: data_${locale}.json`);
    } catch (error) {
      console.error(`Failed to write to data_${locale}.json:`, error);
    }
  };

  fetchDataAndExport();
});
