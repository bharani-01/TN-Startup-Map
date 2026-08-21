export type InvestorType = 'ANGEL' | 'VC' | 'CORPORATE' | 'GOVERNMENT' | 'ACCELERATOR';

export interface Investor {
  id: string;
  publicId: string;
  name: string;
  type: InvestorType;
  website?: string;
  logoUrl?: string;
  description?: string;
  headquartersCity?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorPublicProfile {
  id: string;
  publicId: string;
  name: string;
  type: InvestorType;
  website?: string;
  logoUrl?: string;
  description?: string;
  headquartersCity?: string;
}
