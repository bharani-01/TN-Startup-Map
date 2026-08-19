export interface DistrictGeoJSON {
  type: 'Feature';
  properties: {
    name: string;
    slug: string;
    startupsCount?: number;
    headquarters?: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface District {
  id: string;
  name: string;
  slug: string;
  headquarters: string;
  latitude: number;
  longitude: number;
  description: string;
  startupsCount?: number;
  keySectors?: string[];
  incubatorsCount?: number;
  boundary?: any;
}
