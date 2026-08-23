export type CoordinatePrecision = 'EXACT_ADDRESS' | 'VERIFIED_ADDRESS' | 'CITY_LEVEL' | 'DISTRICT_CENTROID' | 'UNKNOWN';
export type VerificationLevel = 0 | 1 | 2 | 3 | 4;
export type ExistenceStatus = 'EXISTS_CONFIRMED' | 'EXISTS_SUPPORTED' | 'UNCERTAIN' | 'NOT_FOUND';
export type TnAssociation = 'TN_HEADQUARTERED' | 'TN_OPERATING' | 'TN_INCUBATED' | 'TN_FOUNDED' | 'TN_ECOSYSTEM_ASSOCIATED' | 'NO_TN_CONNECTION' | 'UNKNOWN';
export type StartupStatus = 'STARTUP_CONFIRMED' | 'STARTUP_SUPPORTED' | 'NOT_A_STARTUP' | 'UNCERTAIN';
export type DomainStatus = 'VALID_OFFICIAL_DOMAIN' | 'VALID_BUT_OUTDATED' | 'PARKED_DOMAIN' | 'UNRELATED_DOMAIN' | 'DEAD_DOMAIN' | 'NO_DOMAIN' | 'SYNTHETIC_DOMAIN';

export interface FieldProvenance<T> {
  value: T;
  source_url: string;
  source_name: string;
  source_type: 'GOVERNMENT' | 'INCUBATOR' | 'UNIVERSITY_TBI' | 'ANGEL_VC' | 'OFFICIAL_WEBSITE' | 'SECONDARY_DATABASE' | 'NEWS_ANNOUNCEMENT';
  retrieved_at: string;
  verified: boolean;
}

export interface FounderInfo {
  name: string;
  role?: string;
  linkedin?: string;
  education?: string;
  previousCompanies?: string;
  source_url?: string;
  verified: boolean;
}

export interface FundingRound {
  round_type: string;
  amount_inr?: string | null;
  amount_usd?: string | null;
  date?: string | null;
  investors: string[];
  source_url?: string;
  source_name?: string;
}

export interface EvidenceRecord {
  startup_id: string;
  identity: {
    startup_name: FieldProvenance<string>;
    legal_name: FieldProvenance<string>;
    website: FieldProvenance<string | null>;
    logo_url?: string | null;
    short_description: FieldProvenance<string>;
    founded_year: FieldProvenance<number | null>;
    operating_status: FieldProvenance<'active' | 'acquired' | 'inactive' | 'closed' | 'unknown'>;
  };
  location: {
    state: string;
    district: FieldProvenance<string>;
    city: FieldProvenance<string>;
    headquarters: FieldProvenance<string>;
    coordinates: {
      latitude: number | null;
      longitude: number | null;
      precision: CoordinatePrecision;
      source: string;
    };
  };
  classification: {
    sector: FieldProvenance<string>;
    sub_sector: FieldProvenance<string>;
    industry: FieldProvenance<string>;
    technologies: string[];
    business_model: FieldProvenance<string>;
    startup_stage: FieldProvenance<string>;
    b2b_or_b2c: 'B2B' | 'B2C' | 'D2C' | 'B2B2C';
  };
  founders: FounderInfo[];
  funding: {
    status: string;
    total_funding_inr?: string | null;
    total_funding_usd?: string | null;
    latest_round?: string | null;
    latest_amount?: string | null;
    latest_date?: string | null;
    investors: string[];
    rounds: FundingRound[];
  };
  ecosystem: {
    startupTN_registered: boolean;
    dpiit_recognized: boolean;
    incubators: string[];
    accelerators: string[];
    university_affiliations: string[];
    government_programs: string[];
  };
  verification: {
    level: VerificationLevel;
    confidence_score: number;
    existence_status: ExistenceStatus;
    tn_association: TnAssociation;
    startup_status: StartupStatus;
    website_status: DomainStatus;
    evidence_sources_count: number;
    last_audited: string;
  };
  sources: {
    source_name: string;
    source_type: string;
    source_url: string;
    fields_supported: string[];
    verified: boolean;
  }[];
  anomaly_flags: string[];
}
