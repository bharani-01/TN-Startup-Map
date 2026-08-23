/**
 * Free Multi-Provider Geocoding & Address Suggestion Engine
 * Combines Photon (Komoot/OSM), OpenStreetMap Nominatim, Open-Meteo Geocoding,
 * and a curated Tamil Nadu Innovation Hubs database with parallel querying,
 * intelligent deduplication, and zero API key requirement.
 */

export interface GeoSuggestion {
  id: string;
  source: 'photon' | 'nominatim' | 'open-meteo' | 'local';
  displayName: string;
  name: string;
  road?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  latitude: number;
  longitude: number;
}

// 38 Districts of Tamil Nadu for normalization
export const TN_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
  'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
  'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
  'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
  'Vellore', 'Viluppuram', 'Virudhunagar'
];

// Curated high-frequency Tamil Nadu IT Corridors, Tech Parks, and Incubation Cells
const TN_LOCAL_HUBS = [
  { name: 'IIT Madras Research Park', road: 'Kanagam Road, Taramani', city: 'Taramani', district: 'Chennai', pincode: '600113', lat: 12.9866, lng: 80.2427 },
  { name: 'TIDEL Park Chennai', road: 'No. 4, Rajiv Gandhi Salai (OMR)', city: 'Taramani / OMR', district: 'Chennai', pincode: '600113', lat: 12.9893, lng: 80.2483 },
  { name: 'Ascendas International Tech Park', road: 'CSIR Road, Taramani', city: 'Taramani', district: 'Chennai', pincode: '600113', lat: 12.9845, lng: 80.2471 },
  { name: 'DLF Cybercity', road: 'Mount Poonamallee Road, Manapakkam', city: 'Porur', district: 'Chennai', pincode: '600089', lat: 13.0189, lng: 80.1652 },
  { name: 'Olympia Tech Park', road: '1 SIDCO Industrial Estate, Guindy', city: 'Guindy', district: 'Chennai', pincode: '600032', lat: 13.0084, lng: 80.2087 },
  { name: 'RMZ Millenia Business Park', road: 'Campus 1A, MGR Road, Kandanchavadi', city: 'Perungudi / OMR', district: 'Chennai', pincode: '600096', lat: 12.9644, lng: 80.2464 },
  { name: 'Ramanujan IT City', road: 'TRIL Info Park, Rajiv Gandhi Salai', city: 'Taramani', district: 'Chennai', pincode: '600113', lat: 12.9877, lng: 80.2465 },
  { name: 'Ambattur Industrial Estate', road: 'Third Main Road, Ambattur', city: 'Ambattur', district: 'Chennai', pincode: '600058', lat: 13.0945, lng: 80.1587 },
  { name: 'SIPCOT IT Park Siruseri', road: 'Rajiv Gandhi Salai, Siruseri', city: 'Siruseri / OMR', district: 'Chengalpattu', pincode: '603103', lat: 12.8277, lng: 80.2185 },
  { name: 'Mahindra World City', road: 'GST Road, Paranur', city: 'Chengalpattu', district: 'Chengalpattu', pincode: '603002', lat: 12.7214, lng: 79.9984 },
  { name: 'TIDEL Park Coimbatore', road: 'ELCOT SEZ, Civil Aerodrome Post', city: 'Coimbatore', district: 'Coimbatore', pincode: '641014', lat: 11.0264, lng: 77.0277 },
  { name: 'CHIL SEZ IT Park (Cognizant)', road: 'Keeranatham Main Road', city: 'Saravanampatti', district: 'Coimbatore', pincode: '641035', lat: 11.0856, lng: 77.0019 },
  { name: 'PSG-STEP Science & Tech Park', road: 'Avinashi Road, Peelamedu', city: 'Peelamedu', district: 'Coimbatore', pincode: '641004', lat: 11.0242, lng: 77.0028 },
  { name: 'Eachanari Industrial Zone', road: 'Pollachi Main Road', city: 'Eachanari', district: 'Coimbatore', pincode: '641021', lat: 10.9324, lng: 76.9744 },
  { name: 'SIPCOT Industrial Complex Phase I', road: 'Bangalore Road', city: 'Hosur', district: 'Krishnagiri', pincode: '635126', lat: 12.7356, lng: 77.8189 },
  { name: 'SIPCOT Industrial Complex Phase II', road: 'Mornapalli, NH 44', city: 'Hosur', district: 'Krishnagiri', pincode: '635109', lat: 12.7409, lng: 77.8253 },
  { name: 'ELCOT IT Park Vadapalanji', road: 'Madurai Kamaraj University Post', city: 'Vadapalanji', district: 'Madurai', pincode: '625021', lat: 9.9458, lng: 78.0261 },
  { name: 'Thiagarajar TBI (TCE)', road: 'Thiruparankundram', city: 'Madurai', district: 'Madurai', pincode: '625015', lat: 9.8828, lng: 78.0818 },
  { name: 'ELCOT IT Park Navalpattu', road: 'Navalpattu Village', city: 'Navalpattu', district: 'Tiruchirappalli', pincode: '620026', lat: 10.7589, lng: 78.8132 },
  { name: 'NIT-Trichy CEDI', road: 'Tanjore Main Road, Thuvakudi', city: 'Thuvakudi', district: 'Tiruchirappalli', pincode: '620015', lat: 10.7612, lng: 78.8145 },
  { name: 'ELCOT IT Park Salem', road: 'Jagir Ammapalayam', city: 'Salem', district: 'Salem', pincode: '636302', lat: 11.6854, lng: 78.1132 },
  { name: 'ELCOT IT Park Gangaikondan', road: 'Gangaikondan SEZ, NH 44', city: 'Gangaikondan', district: 'Tirunelveli', pincode: '627352', lat: 8.8541, lng: 77.7712 },
  { name: 'VIT Technology Business Incubator', road: 'VIT Campus, Katpadi', city: 'Vellore', district: 'Vellore', pincode: '632014', lat: 12.9692, lng: 79.1559 },
];

/**
 * Match a raw district string to one of the official 38 Tamil Nadu districts
 */
export function normalizeTamilNaduDistrict(rawDistrict?: string): string | undefined {
  if (!rawDistrict) return undefined;
  const clean = rawDistrict.toLowerCase().replace(/district|dt/gi, '').trim();
  return TN_DISTRICTS.find((d) => d.toLowerCase() === clean || clean.includes(d.toLowerCase()));
}

/**
 * Provider 1: Photon API (Komoot / OSM / Elasticsearch) - Free, ultra-fast
 */
async function fetchPhotonSuggestions(query: string): Promise<GeoSuggestion[]> {
  try {
    const cleanQ = query.trim();
    // Bias towards Tamil Nadu center coordinates (lat: 11.1271, lon: 78.6569)
    const endpoint = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQ)}&lat=11.1271&lon=78.6569&limit=6&lang=en`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.features || !Array.isArray(data.features)) return [];

    return data.features
      .filter((f: any) => f.geometry && f.geometry.coordinates)
      .map((f: any, idx: number) => {
        const p = f.properties || {};
        const [lon, lat] = f.geometry.coordinates;
        const name = p.name || p.street || p.city || 'Location';
        const road = [p.street, p.housenumber].filter(Boolean).join(' ') || undefined;
        const city = p.city || p.district || p.locality || p.county || '';
        const district = normalizeTamilNaduDistrict(p.district || p.county || p.city || '');
        const state = p.state || 'Tamil Nadu';
        const pincode = p.postcode || '';

        const addressParts = [name, road, city, district, pincode, state, 'India']
          .filter(Boolean)
          .filter((v, i, a) => a.indexOf(v) === i);

        return {
          id: `photon-${idx}-${lat}-${lon}`,
          source: 'photon' as const,
          displayName: addressParts.join(', '),
          name,
          road,
          city,
          district,
          state,
          pincode,
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lon.toFixed(6)),
        };
      });
  } catch {
    return [];
  }
}

/**
 * Provider 2: OpenStreetMap Nominatim API - Free, high-accuracy structured data
 */
async function fetchNominatimSuggestions(query: string, districtContext?: string): Promise<GeoSuggestion[]> {
  try {
    const cleanQ = query.trim();
    const queryWithContext = cleanQ.toLowerCase().includes('tamil nadu') || cleanQ.toLowerCase().includes('chennai')
      ? cleanQ
      : `${cleanQ}, ${districtContext || 'Tamil Nadu'}, India`;

    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryWithContext)}&countrycodes=in&limit=5&addressdetails=1`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: { 'Accept-Language': 'en' },
    });
    clearTimeout(timer);
    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: any, idx: number) => {
      const addr = item.address || {};
      const shortName = item.display_name.split(',')[0];
      const road = addr.road || addr.building || addr.amenity || undefined;
      const city = addr.city || addr.town || addr.suburb || addr.neighbourhood || addr.village || '';
      const district = normalizeTamilNaduDistrict(addr.state_district || addr.county || addr.city || '');
      const state = addr.state || 'Tamil Nadu';
      const pincode = addr.postcode || '';
      const lat = Number(parseFloat(item.lat).toFixed(6));
      const lon = Number(parseFloat(item.lon).toFixed(6));

      return {
        id: `nominatim-${idx}-${lat}-${lon}`,
        source: 'nominatim' as const,
        displayName: item.display_name,
        name: shortName,
        road,
        city,
        district,
        state,
        pincode,
        latitude: lat,
        longitude: lon,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Provider 3: Open-Meteo Geocoding API - Free, 0ms rate-limit for administrative places
 */
async function fetchOpenMeteoSuggestions(query: string): Promise<GeoSuggestion[]> {
  try {
    const cleanQ = query.trim();
    const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQ)}&count=4&language=en&format=json`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results
      .filter((r: any) => r.country_code === 'IN' || (r.admin1 && r.admin1.includes('Tamil')))
      .map((r: any, idx: number) => {
        const lat = Number(r.latitude.toFixed(6));
        const lon = Number(r.longitude.toFixed(6));
        const name = r.name || 'Location';
        const district = normalizeTamilNaduDistrict(r.admin2 || r.admin1 || name);
        const city = r.name || '';
        const state = r.admin1 || 'Tamil Nadu';

        return {
          id: `openmeteo-${idx}-${lat}-${lon}`,
          source: 'open-meteo' as const,
          displayName: [name, r.admin2, state, 'India'].filter(Boolean).join(', '),
          name,
          city,
          district,
          state,
          latitude: lat,
          longitude: lon,
        };
      });
  } catch {
    return [];
  }
}

/**
 * Provider 4: Instant 0ms Local Tamil Nadu Innovation Hub & Landmark Database
 */
function fetchLocalTNHubs(query: string): GeoSuggestion[] {
  const cleanQ = query.trim().toLowerCase();
  if (cleanQ.length < 2) return [];

  return TN_LOCAL_HUBS
    .filter((h) => 
      h.name.toLowerCase().includes(cleanQ) || 
      h.road.toLowerCase().includes(cleanQ) || 
      h.city.toLowerCase().includes(cleanQ) ||
      h.district.toLowerCase().includes(cleanQ)
    )
    .map((h, idx) => ({
      id: `local-${idx}-${h.lat}-${h.lng}`,
      source: 'local' as const,
      displayName: `${h.name}, ${h.road}, ${h.city}, ${h.district}, Tamil Nadu - ${h.pincode}`,
      name: h.name,
      road: h.road,
      city: h.city,
      district: h.district,
      state: 'Tamil Nadu',
      pincode: h.pincode,
      latitude: h.lat,
      longitude: h.lng,
    }));
}

/**
 * Universal Unified Free Geocoding Query:
 * Runs all free APIs in parallel, merges results, and deduplicates by distance
 */
export async function searchFreeAddressSuggestions(
  query: string, 
  districtContext?: string
): Promise<GeoSuggestion[]> {
  if (!query || query.trim().length < 2) return [];

  // 1. Instant local results
  const localResults = fetchLocalTNHubs(query);

  // 2. Fetch all external free APIs in parallel with fast timeouts
  const [photonResults, nominatimResults, openMeteoResults] = await Promise.all([
    fetchPhotonSuggestions(query),
    fetchNominatimSuggestions(query, districtContext),
    fetchOpenMeteoSuggestions(query),
  ]);

  // 3. Merge all sources: Local -> Photon -> Nominatim -> Open-Meteo
  const combined = [
    ...localResults,
    ...photonResults,
    ...nominatimResults,
    ...openMeteoResults,
  ];

  // 4. Deduplicate items that have coordinates within ~150 meters of each other or identical names
  const deduplicated: GeoSuggestion[] = [];
  for (const item of combined) {
    const isDuplicate = deduplicated.some((existing) => {
      const distLat = Math.abs(existing.latitude - item.latitude);
      const distLng = Math.abs(existing.longitude - item.longitude);
      const isVeryClose = distLat < 0.002 && distLng < 0.002;
      const isSameName = existing.name.toLowerCase().trim() === item.name.toLowerCase().trim();
      return isVeryClose || isSameName;
    });

    if (!isDuplicate) {
      deduplicated.push(item);
    }
  }

  return deduplicated.slice(0, 6);
}
