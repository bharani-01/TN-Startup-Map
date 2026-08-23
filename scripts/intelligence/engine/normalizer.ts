import { normalizeDistrict } from '../geo/tnDistricts.js';
import { normalizeSector } from '../taxonomy/sectors.js';
import { calculateVerification, SourceRecord, VerificationResult } from './verification.js';

export interface RawStartupInput {
  name: string;
  legalName?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  shortDescription?: string | null;
  foundedYear?: number | null;
  incorporationDate?: string | null;
  district?: string | null;
  city?: string | null;
  headquarters?: string | null;
  sector?: string | null;
  subSector?: string | null;
  industry?: string | null;
  technologies?: string[] | null;
  businessModel?: string | null;
  stage?: string | null;
  founders?: { name: string; role?: string; linkedin?: string }[] | null;
  fundingStatus?: string | null;
  totalFunding?: string | number | null;
  latestRound?: string | null;
  latestAmount?: string | number | null;
  latestDate?: string | null;
  investors?: string[] | null;
  startupTnRegistered?: boolean | null;
  dpiitRecognized?: boolean | null;
  incubators?: string[] | null;
  accelerators?: string[] | null;
  universityAffiliations?: string[] | null;
  governmentPrograms?: string[] | null;
  products?: string[] | null;
  services?: string[] | null;
  targetMarket?: string | null;
  b2bOrB2c?: 'B2B' | 'B2C' | 'D2C' | 'B2B2C' | '' | null;
  status?: 'active' | 'acquired' | 'inactive' | 'closed' | 'unknown';
  sources?: SourceRecord[];
}

export interface StandardStartupRecord {
  startup_name: string;
  legal_name: string;
  website: string;
  logo_url: string;
  short_description: string;
  founded_year: number | null;
  incorporation_date: string | null;

  location: {
    state: string;
    district: string;
    city: string;
    headquarters: string;
    latitude: number | null;
    longitude: number | null;
  };

  classification: {
    sector: string;
    sub_sector: string;
    industry: string;
    technology: string[];
    business_model: string;
    startup_stage: string;
  };

  founders: {
    name: string;
    role?: string;
    linkedin?: string;
  }[];

  funding: {
    status: string;
    total_funding: string | number | null;
    latest_round: string;
    latest_amount: string | number | null;
    latest_date: string | null;
    investors: string[];
  };

  ecosystem: {
    startupTN_registered: boolean | null;
    dpiit_recognized: boolean | null;
    incubator: string[];
    accelerator: string[];
    university_affiliation: string[];
    government_programs: string[];
  };

  products: string[];
  services: string[];
  target_market: string;
  b2b_or_b2c: string;

  status: 'active' | 'acquired' | 'inactive' | 'closed' | 'unknown';

  verification: VerificationResult;
}

export function normalizeStartupRecord(raw: RawStartupInput): StandardStartupRecord {
  // Normalize Location
  const geo = normalizeDistrict(raw.district || raw.city || raw.headquarters || 'Chennai');
  const city = raw.city || geo.headquarters || `${geo.name}, Tamil Nadu`;
  const headquarters = raw.headquarters || `${geo.name}, Tamil Nadu, India`;

  // Normalize Sector & Classification
  const tax = normalizeSector(raw.sector || '', raw.shortDescription || '');
  const techList = Array.from(new Set([...(raw.technologies || []), ...tax.defaultTechnologies]));

  // Normalize Sources & Verification
  const sourcesList: SourceRecord[] = raw.sources && raw.sources.length > 0
    ? raw.sources
    : [{
        source_name: 'Startup Ecosystem Research',
        source_type: 'SECONDARY_DATABASE',
        source_url: raw.website || 'https://startuptn.in',
        verified: true,
      }];

  const verification = calculateVerification(
    sourcesList,
    raw.website,
    raw.startupTnRegistered,
    raw.dpiitRecognized,
    Boolean(raw.founders && raw.founders.length > 0),
    Boolean(raw.totalFunding || raw.latestAmount)
  );

  return {
    startup_name: raw.name.trim(),
    legal_name: raw.legalName ? raw.legalName.trim() : `${raw.name.trim()} Private Limited`,
    website: raw.website || '',
    logo_url: raw.logoUrl || (raw.website ? `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${raw.website}&size=128` : ''),
    short_description: raw.shortDescription || `${raw.name} operates in the ${tax.sector} (${tax.subSector}) sector in ${geo.name}, Tamil Nadu.`,
    founded_year: raw.foundedYear || null,
    incorporation_date: raw.incorporationDate || null,

    location: {
      state: 'Tamil Nadu',
      district: geo.name,
      city: city,
      headquarters: headquarters,
      latitude: geo.latitude,
      longitude: geo.longitude,
    },

    classification: {
      sector: raw.sector || tax.sector,
      sub_sector: raw.subSector || tax.subSector,
      industry: raw.industry || tax.industry,
      technology: techList,
      business_model: raw.businessModel || 'B2B',
      startup_stage: raw.stage || 'Seed',
    },

    founders: raw.founders || [],

    funding: {
      status: raw.fundingStatus || (raw.totalFunding ? 'Funded' : 'Bootstrapped'),
      total_funding: raw.totalFunding || null,
      latest_round: raw.latestRound || (raw.totalFunding ? 'Seed' : 'Bootstrapped'),
      latest_amount: raw.latestAmount || null,
      latest_date: raw.latestDate || null,
      investors: raw.investors || [],
    },

    ecosystem: {
      startupTN_registered: raw.startupTnRegistered !== undefined ? raw.startupTnRegistered : true,
      dpiit_recognized: raw.dpiitRecognized !== undefined ? raw.dpiitRecognized : true,
      incubator: raw.incubators || [],
      accelerator: raw.accelerators || [],
      university_affiliation: raw.universityAffiliations || [],
      government_programs: raw.governmentPrograms || [],
    },

    products: raw.products || [],
    services: raw.services || [],
    target_market: raw.targetMarket || 'India & Global Enterprise',
    b2b_or_b2c: raw.b2bOrB2c || 'B2B',

    status: raw.status || 'active',

    verification: verification,
  };
}
