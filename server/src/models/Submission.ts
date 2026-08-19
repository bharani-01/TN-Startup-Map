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

export interface Submission {
  id: string;
  data: StartupSubmissionDTO;
  status: SubmissionStatus;
  submittedByEmail: string;
  submittedByUserId?: string;
  reviewedByUserId?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}
