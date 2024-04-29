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

const fetchDetails = async (id, locale) => {
  let detailResponse = await fetch(`${URL}/getRepositoryItem?id=${id}&lang=${locale}`);
  if (!detailResponse.ok) {
    // If the first request is not successful, try the alternative URL
    detailResponse = await fetch(`${URL}/getRepositoryItem?info030=${id}&lang=${locale}`);
  }
  return detailResponse.ok ? await detailResponse.json() : null;
};


locales.forEach(locale => {
  const fetchDataAndExport = async () => {
    let allInstitutionsDetails = []; // Initialize an array to store details
    try {
      // Fetch-Anfrage
      const response = await fetch(`${URL}/getRepositoryList?portalURI=http://digicult.vocnet.org/portal/p0287&count=9999&lang=${locale}`);
      const responseBody = await response.json();
      // Create a temporary map for quick access to institution tags by ID
      const tagsMap = responseBody.Actor.reduce((acc, current) => {
        acc[current.id] = current.tags; // Assuming 'tags' is the attribute you need
        return acc;
      }, {});

      // Fetch details for each institution
      for (const actor of responseBody.Actor) {
        const detailResponseBody = await fetchDetails(actor.id, locale);
        if (detailResponseBody) {// Append tags from the tagsMap by institution ID before adding to details array
          const detailsWithTags = { ...detailResponseBody, tags: tagsMap[actor.id] };// Add the fetched details to the array
          //allInstitutionsDetails.push(detailResponseBody);
          allInstitutionsDetails.push(detailsWithTags);
        } else {
          console.log(`Failed to fetch details for institution ID ${actor.id}`);
        }
      }
      // After collecting all details, export them into a single JSON file for the current locale
      const filename = `institutions_details_${locale}.json`;
      await fs.writeFile(filename, JSON.stringify(allInstitutionsDetails, null, 2));
      console.log(`Exported details for all institutions to file: ${filename}`);
    } catch (error) {
      console.error(`Failed to write to data_${locale}.json:`, error);
      return [];
    }
  };

  fetchDataAndExport();

});

