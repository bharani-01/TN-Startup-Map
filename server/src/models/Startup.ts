import { VerificationStatus } from '../utils/constants.js';

export type StartupStage = 'Idea' | 'Pre-seed' | 'Seed' | 'Series A' | 'Series B+' | 'Bootstrapped' | 'Acquired';
export type FundingType = 'Bootstrapped' | 'Angel' | 'Pre-seed' | 'Seed' | 'Venture funded';

export interface FounderInfo {
  id?: string;
  publicId?: string;
  name: string;
  role: string; // roleTitle in schema
  roleTitle?: string;
  bio?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  avatarUrl?: string;
  education?: string;
  previousCompanies?: string;
  displayOrder?: number;
}

export interface FundingRoundInfo {
  id?: string;
  roundType: string;
  amountInr?: string;
  amountUsd?: string;
  date: string; // roundDate in schema
  roundDate?: string;
  investors: string[];
  leadInvestorId?: string;
  leadInvestorName?: string;
  sourceUrl?: string;
  announcedAt?: string;
}

export interface CompanyPost {
  id: string;
  title: string;
  content: string;
  date: string;
  tag?: string;
  linkUrl?: string;
  imageUrl?: string;
}

export interface CustomProfileSection {
  id: string;
  title: string;
  content: string;
  displayOrder?: number;
  items?: Array<{ label: string; value: string }>;
}

export interface StartupMediaItem {
  id?: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  url: string;
  caption?: string;
  displayOrder?: number;
}

export interface Startup {
  id: string; // UUID primary key
  publicId?: string; // Cryptographic public ID (stp_...)
  slug: string;
  name: string;
  tagline: string;
  description: string;
  extendedBio?: string;
  logoUrl?: string;
  bannerUrl?: string;
  brandColor?: string;
  website: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  pincode?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
    slack?: string;
    discord?: string;
    youtube?: string;
    blog?: string;
    instagram?: string;
  };
  foundedYear: number;
  stage: StartupStage;
  fundingType: FundingType;
  totalFundingInr?: string;
  totalFundingUsd?: string;
  teamSize: string;
  district: string;
  districtId?: string;
  districtSlug: string;
  city: string;
  latitude: number;
  longitude: number;
  sectors: string[];
  techStack?: string[];
  galleryImages?: string[];
  posts?: CompanyPost[];
  customSections?: CustomProfileSection[];
  founders: FounderInfo[];
  fundingRounds: FundingRoundInfo[];
  verificationStatus: VerificationStatus;
  source: string;
  sourceUrl?: string;
  lastVerifiedAt: string;
  trendingScore: number;
  claimedByUserId?: string;
  isHiring?: boolean;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedByUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StartupFilterQuery {
  search?: string;
  district?: string;
  sector?: string;
  stage?: string;
  foundedYear?: number;
  fundingType?: string;
  verificationStatus?: string;
  isHiring?: boolean;
  includeDeleted?: boolean;
  sortBy?: 'trending' | 'recent' | 'founded' | 'name';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BannerPreset {
  id: string;
  name: string;
  category: string;
  url: string;
  previewUrl: string;
}

export const BANNER_PRESETS: BannerPreset[] = [
  {
    id: 'tn-skyline',
    name: 'Tamil Nadu Heritage & Innovation',
    category: 'Ecosystem Landmark',
    url: '/tn-skyline-hero.png',
    previewUrl: '/tn-skyline-hero.png',
  },
  {
    id: 'deeptech-matrix',
    name: 'DeepTech & SpaceTech Matrix',
    category: 'Deep Tech',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'iitm-cleanroom',
    name: 'Semiconductors & Quantum Silicon',
    category: 'Hardware & Chips',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'saas-cloud',
    name: 'Enterprise Cloud & SaaS Blueprint',
    category: 'Enterprise SaaS',
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ev-cleanenergy',
    name: 'EV Mobility & Clean Energy Horizon',
    category: 'CleanTech & EV',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'agritech-green',
    name: 'Agritech & Precision Green Fields',
    category: 'AgriTech',
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'minimal-pearl',
    name: 'Apple Slate & Minimalist Glass',
    category: 'Design & Studio',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
  },
];
