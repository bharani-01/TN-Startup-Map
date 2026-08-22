// Job-related type definitions for the Hiring Module

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
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
  experience: 'FRESHER' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';
  location?: string;
  isRemote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  skills: string[];
  applyUrl?: string;
  applyEmail?: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  isHidden: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobDTO {
  startupId: string;
  title: string;
  department?: string;
  jobType?: JobListing['jobType'];
  experience?: JobListing['experience'];
  location?: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  skills?: string[];
  applyUrl?: string;
  applyEmail?: string;
  expiresAt?: string;
}

export interface UpdateJobDTO {
  title?: string;
  department?: string;
  jobType?: JobListing['jobType'];
  experience?: JobListing['experience'];
  location?: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  skills?: string[];
  applyUrl?: string;
  applyEmail?: string;
  expiresAt?: string;
  status?: JobListing['status'];
}

export interface JobFilters {
  search?: string;
  jobType?: string;
  experience?: string;
  isRemote?: boolean;
  startupSlug?: string;
  sector?: string;
  limit?: number;
  offset?: number;
}

// In-memory cache
export const jobsCache = new Map<string, JobListing>();
