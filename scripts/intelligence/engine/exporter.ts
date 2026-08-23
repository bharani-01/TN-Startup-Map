import fs from 'fs';
import path from 'path';
import { StandardStartupRecord } from './normalizer.js';
import { DuplicateMatch } from './deduplication.js';
import { INTELLIGENCE_CONFIG } from '../config.js';

export interface MissingDataAudit {
  startup_name: string;
  district: string;
  missing_fields: string[];
  verification_level: number;
  confidence_score: number;
}

export function escapeCsvField(val: any): string {
  if (val === null || val === undefined) return '';
  if (Array.isArray(val)) {
    return `"${val.map(v => typeof v === 'object' ? JSON.stringify(v) : v).join('; ').replace(/"/g, '""')}"`;
  }
  if (typeof val === 'object') {
    return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
  }
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function startupToCsvRow(s: StandardStartupRecord): string {
  const fields = [
    s.startup_name,
    s.legal_name,
    s.website,
    s.location.district,
    s.location.city,
    s.location.latitude,
    s.location.longitude,
    s.classification.sector,
    s.classification.sub_sector,
    s.classification.industry,
    s.classification.business_model,
    s.classification.startup_stage,
    s.founded_year,
    s.founders.map(f => f.name + (f.role ? ` (${f.role})` : '')).join('; '),
    s.funding.status,
    s.funding.total_funding,
    s.funding.latest_round,
    s.funding.latest_amount,
    s.funding.investors.join('; '),
    s.ecosystem.startupTN_registered,
    s.ecosystem.dpiit_recognized,
    s.ecosystem.incubator.join('; '),
    s.status,
    s.verification.level,
    s.verification.confidence_score,
    s.verification.sources.map(src => `${src.source_name} (${src.source_url})`).join('; '),
  ];

  return fields.map(escapeCsvField).join(',');
}

export const CSV_HEADER = [
  'startup_name',
  'legal_name',
  'website',
  'district',
  'city',
  'latitude',
  'longitude',
  'sector',
  'sub_sector',
  'industry',
  'business_model',
  'startup_stage',
  'founded_year',
  'founders',
  'funding_status',
  'total_funding',
  'latest_round',
  'latest_amount',
  'investors',
  'startupTN_registered',
  'dpiit_recognized',
  'incubators',
  'status',
  'verification_level',
  'confidence_score',
  'sources',
].join(',');

export function exportDatasets(
  datasetA: StandardStartupRecord[],
  datasetB: StandardStartupRecord[],
  datasetC: DuplicateMatch[],
  datasetD: MissingDataAudit[]
) {
  const outDir = INTELLIGENCE_CONFIG.outputDir;
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Dataset A - Verified Startups
  const aJsonPath = path.join(outDir, 'dataset_a_verified_startups.json');
  const aCsvPath = path.join(outDir, 'dataset_a_verified_startups.csv');
  fs.writeFileSync(aJsonPath, JSON.stringify(datasetA, null, 2), 'utf-8');
  const aCsvContent = [CSV_HEADER, ...datasetA.map(startupToCsvRow)].join('\n');
  fs.writeFileSync(aCsvPath, aCsvContent, 'utf-8');

  // 2. Dataset B - Potential Startups
  const bJsonPath = path.join(outDir, 'dataset_b_potential_startups.json');
  const bCsvPath = path.join(outDir, 'dataset_b_potential_startups.csv');
  fs.writeFileSync(bJsonPath, JSON.stringify(datasetB, null, 2), 'utf-8');
  const bCsvContent = [CSV_HEADER, ...datasetB.map(startupToCsvRow)].join('\n');
  fs.writeFileSync(bCsvPath, bCsvContent, 'utf-8');

  // 3. Dataset C - Duplicate / Merged Records
  const cJsonPath = path.join(outDir, 'dataset_c_duplicate_records.json');
  const cCsvPath = path.join(outDir, 'dataset_c_duplicate_records.csv');
  fs.writeFileSync(cJsonPath, JSON.stringify(datasetC, null, 2), 'utf-8');
  const cCsvHeader = 'canonical_name,duplicate_name,match_type,similarity_score,sources_found';
  const cCsvContent = [
    cCsvHeader,
    ...datasetC.map(d =>
      [
        escapeCsvField(d.canonicalName),
        escapeCsvField(d.duplicateName),
        escapeCsvField(d.matchType),
        escapeCsvField(d.similarityScore),
        escapeCsvField(d.sourcesFound.join('; ')),
      ].join(',')
    ),
  ].join('\n');
  fs.writeFileSync(cCsvPath, cCsvContent, 'utf-8');

  // 4. Dataset D - Missing Information Audit
  const dJsonPath = path.join(outDir, 'dataset_d_missing_information.json');
  const dCsvPath = path.join(outDir, 'dataset_d_missing_information.csv');
  fs.writeFileSync(dJsonPath, JSON.stringify(datasetD, null, 2), 'utf-8');
  const dCsvHeader = 'startup_name,district,missing_fields,verification_level,confidence_score';
  const dCsvContent = [
    dCsvHeader,
    ...datasetD.map(d =>
      [
        escapeCsvField(d.startup_name),
        escapeCsvField(d.district),
        escapeCsvField(d.missing_fields.join('; ')),
        escapeCsvField(d.verification_level),
        escapeCsvField(d.confidence_score),
      ].join(',')
    ),
  ].join('\n');
  fs.writeFileSync(dCsvPath, dCsvContent, 'utf-8');

  console.log(`[Exporter] Successfully written all datasets to ${outDir}`);
}
