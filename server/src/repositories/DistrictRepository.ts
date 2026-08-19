import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../database/connection.js';
import { District } from '../models/District.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load pre-processed authentic 38 Tamil Nadu district boundary GeoJSON
let cachedRawGeoJson: any = null;
try {
  const geojsonPath = path.resolve(__dirname, '../database/tamilnadu-districts-38-optimized.json');
  if (fs.existsSync(geojsonPath)) {
    cachedRawGeoJson = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
  }
} catch (err) {
  console.error('Failed to load local district GeoJSON file:', err);
}

function normalizeDistrictName(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace('the', '')
    .replace('tuticorin', 'thoothukudi')
    .replace('thiruvallur', 'tiruvallur')
    .replace('thiruvarur', 'tiruvarur')
    .replace('tiruchirappalli', 'tiruchirappalli')
    .replace('tiruchchirappalli', 'tiruchirappalli')
    .replace('kancheepuram', 'kanchipuram');
}

export class DistrictRepository {
  async findAll(): Promise<District[]> {
    db.recomputeCounts();
    return Array.from(db.districts.values()).sort((a, b) => (b.startupsCount || 0) - (a.startupsCount || 0));
  }

  async findBySlug(slug: string): Promise<District | null> {
    db.recomputeCounts();
    const d = Array.from(db.districts.values()).find((item) => item.slug.toLowerCase() === slug.toLowerCase());
    return d || null;
  }

  async findById(id: string): Promise<District | null> {
    db.recomputeCounts();
    const d = db.districts.get(id);
    return d || null;
  }

  async getDistrictsGeoJSON(): Promise<{ type: 'FeatureCollection'; features: any[] }> {
    db.recomputeCounts();
    const districtsList = Array.from(db.districts.values());

    if (cachedRawGeoJson && cachedRawGeoJson.features) {
      // Enrich authentic polygon features with live database metrics
      const features = cachedRawGeoJson.features.map((f: any) => {
        const rawName = f.properties.dtname || f.properties.district || f.properties.name || '';
        const norm = normalizeDistrictName(rawName);
        const dbDistrict = districtsList.find((d) => normalizeDistrictName(d.name) === norm);

        return {
          type: 'Feature',
          geometry: f.geometry,
          properties: {
            dtname: dbDistrict ? dbDistrict.name : rawName,
            id: dbDistrict ? dbDistrict.id : `dist-${norm}`,
            name: dbDistrict ? dbDistrict.name : rawName,
            slug: dbDistrict ? dbDistrict.slug : norm,
            headquarters: dbDistrict ? dbDistrict.headquarters : rawName,
            startupsCount: dbDistrict ? (dbDistrict.startupsCount || 0) : 0,
            keySectors: dbDistrict ? (dbDistrict.keySectors || []) : [],
            incubatorsCount: dbDistrict ? (dbDistrict.incubatorsCount || 0) : 0,
            center: dbDistrict ? [dbDistrict.latitude, dbDistrict.longitude] : undefined,
          },
        };
      });

      return {
        type: 'FeatureCollection',
        features,
      };
    }

    // Fallback if file not available
    const fallbackFeatures = districtsList.map((d) => {
      const deltaLat = 0.22;
      const deltaLng = 0.24;
      const ring = [
        [d.longitude - deltaLng, d.latitude - deltaLat],
        [d.longitude + deltaLng, d.latitude - deltaLat],
        [d.longitude + deltaLng, d.latitude + deltaLat],
        [d.longitude - deltaLng, d.latitude + deltaLat],
        [d.longitude - deltaLng, d.latitude - deltaLat],
      ];

      return {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [ring],
        },
        properties: {
          dtname: d.name,
          id: d.id,
          name: d.name,
          slug: d.slug,
          headquarters: d.headquarters,
          startupsCount: d.startupsCount || 0,
          keySectors: d.keySectors || [],
          incubatorsCount: d.incubatorsCount || 0,
          center: [d.latitude, d.longitude],
        },
      };
    });

    return {
      type: 'FeatureCollection',
      features: fallbackFeatures,
    };
  }
}

export const districtRepository = new DistrictRepository();
