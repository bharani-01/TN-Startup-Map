import { SubmissionStatus } from '../utils/constants.js';
import { StartupStage, FundingType } from './Startup.js';

export interface StartupSubmissionDTO {
  name: string;
  website: string;
  tagline: string;
  description: string;
  founderName: string;
  founderEmail: string;
  founderPhone?: string;
  founderLinkedin?: string;
  city: string;
  district: string;
  sectors: string[];
  foundedYear: number;
  stage: StartupStage;
  fundingType: FundingType;
  teamSize?: string;
  linkedin?: string;
  logoUrl?: string;
  sourceUrl?: string;
}

export interface SubmissionReviewItem {
  id?: string;
  reviewerUserId: string;
  reviewerName?: string;
  action: 'COMMENT' | 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES';
  notes?: string;
  createdAt: string;
}

export interface Submission {
  id: string; // UUID primary key
  publicId?: string; // Cryptographic public ID (sub_...)
  data: StartupSubmissionDTO;
  status: SubmissionStatus;
  submittedByEmail: string;
  submittedByUserId?: string;
  reviewedByUserId?: string;
  adminNotes?: string;
  reviews?: SubmissionReviewItem[];
  createdAt: string;
  updatedAt: string;
}
