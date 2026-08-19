import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const geojsonPath = path.resolve(__dirname, '../../../../public/tamilnadu-districts.geojson');
const data = JSON.parse(fs.readFileSync(geojsonPath, 'utf-8'));

console.log('Total features:', data.features.length);
data.features.slice(0, 5).forEach((f, i) => {
  console.log(`Feature ${i}:`, JSON.stringify(f.properties || f));
});
