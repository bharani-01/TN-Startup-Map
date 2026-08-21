import { ClaimStatus, VerificationStatus } from '../utils/constants.js';

export interface ClaimRequestDTO {
  startupId: string;
  startupSlug: string;
  claimantName: string;
  claimantEmail: string;
  claimantRole: string;
  claimantLinkedin: string;
  proofDetails: string;
  workEmail?: string;
}

export interface ClaimEvidenceItem {
  id?: string;
  evidenceType: 'LINKEDIN_PROFILE' | 'CORPORATE_EMAIL' | 'INCORPORATION_CERT' | 'ID_DOCUMENT' | 'OTHER';
  url?: string;
  description?: string;
  submittedAt?: string;
  reviewedByUserId?: string;
  reviewNotes?: string;
}

export interface Claim {
  id: string; // UUID primary key
  publicId?: string; // Cryptographic public ID (clm_...)
  startupId: string;
  startupSlug: string;
  startupName: string;
  claimantName: string;
  claimantEmail: string;
  claimantRole: string;
  claimantLinkedin?: string;
  proofDetails: string;
  status: ClaimStatus;
  userId?: string;
  userAccountId?: string;
  reviewedByUserId?: string;
  adminNotes?: string;
  evidence?: ClaimEvidenceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface VerificationRecord {
  id: string;
  entityType: 'STARTUP' | 'FOUNDER' | 'INVESTOR' | 'INCUBATOR';
  entityId: string;
  status: VerificationStatus;
  verifiedByUserId: string;
  source: string;
  sourceUrl?: string;
  notes?: string;
  createdAt: string;
}
