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

export interface Claim {
  id: string;
  startupId: string;
  startupSlug: string;
  startupName: string;
  claimantName: string;
  claimantEmail: string;
  claimantRole: string;
  claimantLinkedin: string;
  proofDetails: string;
  status: ClaimStatus;
  userId?: string;
  reviewedByUserId?: string;
  adminNotes?: string;
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
