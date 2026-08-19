import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urls = [
  'https://raw.githubusercontent.com/datta07/INDIAN-SHAPEFILES/master/TAMIL%20NADU_DISTRICTS.geojson',
  'https://raw.githubusercontent.com/udit-001/india-maps-data/master/geojson/tamil-nadu.json',
  'https://raw.githubusercontent.com/geohacker/india/master/district/tamil-nadu.geojson',
  'https://raw.githubusercontent.com/HindustanTimesLabs/shapefiles/master/state_ut/tamilnadu/district/tamilnadu_district.json'
];

async function tryDownload(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  for (const u of urls) {
    try {
      console.log(`Trying ${u}...`);
      const raw = await tryDownload(u);
      const parsed = JSON.parse(raw);
      if (parsed && parsed.features && parsed.features.length > 0) {
        console.log(`Success! Found GeoJSON with ${parsed.features.length} real district features.`);
        const dest = path.resolve(__dirname, '../../../../public/tamilnadu-districts.geojson');
        fs.writeFileSync(dest, JSON.stringify(parsed, null, 2), 'utf-8');
        console.log(`Saved to ${dest}`);
        return;
      }
    } catch (e) {
      console.warn(`Failed: ${e.message}`);
    }
  }
}

main();
