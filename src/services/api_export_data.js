const fetch = require('node-fetch');
const fs = require('fs').promises;
const URL = 'https://kultursphaere.sh/corsproxy.php?url=http://xtree-actor-api.digicult-verbund.de';
const locales = ['de', 'da', 'en']; // Define the locales array
// Fetch and export data
locales.forEach(locale => {
const fetchDataAndExport = async () => {
  try{
    const response = await fetch(`${URL}/getRepositoryList?portalURI=http://digicult.vocnet.org/portal/p0287&count=9999&lang=${locale}`);
    const text = await response.text();

    // Check if the data is JSON
    if (text[0] === '{' || text[0] === '[') {
      // It's likely JSON
      const response = JSON.parse(text);
      console.log(response.header.actorCount);
      const migrated = [];
      migrated.push(
        {
          id: response.Actor.id
        }
      )
      //await fs.writeFile(`data_${locale}.json`, JSON.stringify(data, null, 2));
      console.log(`Data has been written to data_${locale}.json`);
    } else {
      // Probably not JSON
      console.error("Returned data is not JSON. Data: ", text);
      throw new Error('The data returned from the URL is not in JSON format');
    }
  } catch (error) {
    console.error("Failed to write to data.json:", error);
  }
};

// Execute data fetch and export
fetchDataAndExport();
});
