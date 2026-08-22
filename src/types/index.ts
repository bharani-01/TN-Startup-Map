export type UserRole = 'USER' | 'FOUNDER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string; // Random internal ID
  displayId?: string; // Human readable reference code (e.g. TN-FND-8492)
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  companyName?: string;
  claimedStartupId?: string;
  claimedStartupIds?: string[];
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type StartupStage = 'Idea' | 'Pre-seed' | 'Seed' | 'Series A' | 'Series B+' | 'Bootstrapped' | 'Acquired';

export type FundingType = 'Bootstrapped' | 'Angel' | 'Pre-seed' | 'Seed' | 'Venture funded';

export interface FounderInfo {
  name: string;
  role: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
  avatarUrl?: string;
  education?: string;
  previousCompanies?: string;
}

export interface FundingRoundInfo {
  roundType: string;
  amountInr?: string;
  amountUsd?: string;
  date: string;
  investors: string[];
  sourceUrl?: string;
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
  items?: Array<{ label: string; value: string }>;
}

export interface StartupMilestone {
  id?: string;
  title: string;
  description?: string;
  date: string;
  category?: string;
  displayOrder?: number;
}

export interface StartupAward {
  id?: string;
  title: string;
  organization?: string;
  year?: number;
  url?: string;
}

export interface StartupClient {
  id?: string;
  name: string;
  logoUrl?: string;
  website?: string;
  displayOrder?: number;
}

export interface StartupPress {
  id?: string;
  title: string;
  publication: string;
  url: string;
  publishedDate?: string;
}

export interface Startup {
  id: string;
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
  };
  foundedYear: number;
  stage: StartupStage;
  fundingType: FundingType;
  totalFundingInr?: string;
  totalFundingUsd?: string;
  teamSize: string;
  district: string;
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

  // Extended custom profile fields
  businessModel?: string;
  revenueModel?: string;
  revenueRange?: string;
  targetMarket?: string;
  customerSegments?: string[];
  incubator?: string;
  accelerator?: string;
  dpiitNumber?: string;
  demoVideoUrl?: string;
  pitchDeckUrl?: string;
  competitiveEdge?: string;
  isProfitable?: boolean;
  milestones?: StartupMilestone[];
  awards?: StartupAward[];
  keyClients?: StartupClient[];
  pressMentions?: StartupPress[];

  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'CLAIMED';
  source: string;
  sourceUrl?: string;
  lastVerifiedAt: string;
  trendingScore: number;
  claimedByUserId?: string;
  isHiring?: boolean;
  jobListings?: JobListing[];
  distanceKm?: number;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedByUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
export type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT';
export type JobExperience = 'FRESHER' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';

export interface JobListing {
  id: string;
  publicId: string;
  startupId: string;
  startupSlug?: string;
  startupName?: string;
  startupLogoUrl?: string;
  startupSectors?: string[];
  postedById?: string;
  title: string;
  department?: string;
  jobType: JobType;
  experience: JobExperience;
  location?: string;
  isRemote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  skills: string[];
  applyUrl?: string;
  applyEmail?: string;
  status: JobStatus;
  isHidden: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
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
}

export interface Sector {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  startupsCount?: number;
}

export interface EcosystemStats {
  totalStartups: number;
  totalDistricts: number;
  activeDistricts: number;
  totalSectors: number;
  totalFounders: number;
  totalInvestors: number;
  totalIncubators: number;
  startupsHiring: number;
  recentlyFundedCount: number;
  totalUsers: number;
  pendingSubmissionsCount: number;
  pendingClaimsCount: number;
  topDistricts: Array<{ name: string; slug: string; count: number }>;
  topSectors: Array<{ name: string; slug: string; count: number }>;
}

export interface SearchResultItem {
  id: string;
  type: 'STARTUP' | 'DISTRICT' | 'SECTOR' | 'FOUNDER';
  title: string;
  subtitle: string;
  slug: string;
  url: string;
  badge?: string;
  icon?: string;
}

export interface GlobalSearchResults {
  query: string;
  total: number;
  results: {
    startups: SearchResultItem[];
    districts: SearchResultItem[];
    sectors: SearchResultItem[];
    founders: SearchResultItem[];
  };
}

export type BlogCategory = 
  | 'Founder Stories'
  | 'Ecosystem News'
  | 'DeepTech Insights'
  | 'Policy & Grants'
  | 'Fundraising'
  | 'Tech Architecture';

export type BlogStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  category: BlogCategory;
  coverImageUrl?: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorRole: string;
  authorEmail: string;
  authorAvatarUrl?: string;
  isFounder: boolean;
  startupId?: string;
  startupName?: string;
  startupSlug?: string;
  status: BlogStatus;
  featured: boolean;
  clapsCount: number;
  readTimeMinutes: number;
  publishedAt: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedByUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilterQuery {
  search?: string;
  category?: string;
  tag?: string;
  authorId?: string;
  startupId?: string;
  status?: string;
  featured?: boolean;
  includeDeleted?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'recent' | 'claps' | 'title';
  order?: 'asc' | 'desc';
}
