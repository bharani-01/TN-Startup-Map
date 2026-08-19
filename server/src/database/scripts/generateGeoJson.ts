import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_TN_DISTRICTS } from '../data/districts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../../../../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate valid GeoJSON features for all 38 districts with bounding polygons
const features = ALL_TN_DISTRICTS.map((d) => {
  const r = 0.22; // approx 25km radius polygon
  const coords = [];
  const numPoints = 8;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints;
    const lat = d.latitude + (r * Math.sin(angle));
    const lng = d.longitude + (r * Math.cos(angle) * 1.05);
    coords.push([Number(lng.toFixed(4)), Number(lat.toFixed(4))]);
  }

  return {
    type: 'Feature',
    properties: {
      district: d.name,
      slug: d.slug,
      headquarters: d.headquarters,
      keySectors: d.keySectors,
      incubatorsCount: d.incubatorsCount,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [coords],
    },
  };
});

const geoJson = {
  type: 'FeatureCollection',
  features,
};

const outputPath = path.join(publicDir, 'tamilnadu-districts.geojson');
fs.writeFileSync(outputPath, JSON.stringify(geoJson, null, 2), 'utf-8');
console.log(`Generated valid GeoJSON with ${features.length} districts at ${outputPath}`);
