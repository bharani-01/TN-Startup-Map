import bcrypt from 'bcryptjs';
import { claimRepository } from '../repositories/ClaimRepository.js';
import { startupRepository } from '../repositories/StartupRepository.js';
import { userRepository } from '../repositories/UserRepository.js';
import { emailService } from './EmailService.js';
import { ClaimRequestDTO, Claim } from '../models/Claim.js';
import { generateInternalUserId } from '../models/User.js';
import { ClaimStatus, UserRole } from '../utils/constants.js';
import { ApiError } from '../utils/ApiError.js';
import { generatePublicId } from '../utils/publicId.js';

export class ClaimService {
  async submitClaim(data: ClaimRequestDTO, userId?: string): Promise<Claim> {
    const startup = await startupRepository.findById(data.startupId) || await startupRepository.findBySlug(data.startupSlug);
    if (!startup) {
      throw ApiError.notFound('Target startup for claim not found');
    }

    if (!data.claimantName || !data.claimantEmail || !data.claimantRole || !data.proofDetails) {
      throw ApiError.badRequest('Name, official email, role, and proof of association are required to claim a startup profile');
    }

    const newClaim: Claim = {
      id: `clm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      publicId: generatePublicId('clm'),
      startupId: startup.id,
      startupSlug: startup.slug,
      startupName: startup.name,
      claimantName: data.claimantName,
      claimantEmail: data.claimantEmail,
      claimantRole: data.claimantRole,
      claimantLinkedin: data.claimantLinkedin,
      proofDetails: data.proofDetails,
      status: ClaimStatus.PENDING_REVIEW,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return claimRepository.create(newClaim);
  }

  async getPendingClaims(): Promise<Claim[]> {
    return claimRepository.findAll(ClaimStatus.PENDING_REVIEW);
  }

  async getAllClaims(status?: ClaimStatus): Promise<Claim[]> {
    return claimRepository.findAll(status);
  }

  async approveClaim(claimId: string, reviewedByUserId: string, adminNotes?: string) {
    const claim = await claimRepository.findById(claimId);
    if (!claim) {
      throw ApiError.notFound('Claim record not found');
    }

    if (claim.status !== ClaimStatus.PENDING_REVIEW) {
      throw ApiError.badRequest(`Claim is already in status: ${claim.status}`);
    }

    const claimantEmail = claim.claimantEmail.trim().toLowerCase();
    const claimantName = claim.claimantName.trim();
    const tempPassword = emailService.generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    const existingUser = await userRepository.findByEmail(claimantEmail);
    let userId = claim.userId;
    let isNewUser = false;

    if (existingUser) {
      userId = existingUser.id;
      await userRepository.update(existingUser.id, {
        role: UserRole.FOUNDER,
        companyName: claim.startupName,
        claimedStartupId: claim.startupId,
        passwordHash,
      });
    } else {
      isNewUser = true;
      userId = generateInternalUserId();
      const publicId = generatePublicId('usr');
      await userRepository.create({
        id: userId,
        publicId,
        displayId: publicId,
        email: claimantEmail,
        name: claimantName,
        role: UserRole.FOUNDER,
        companyName: claim.startupName,
        claimedStartupId: claim.startupId,
        passwordHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Link user as founder of startup
    await startupRepository.update(claim.startupId, {
      claimedByUserId: userId,
    });

    // Send Welcome Email
    await emailService.sendFounderWelcomeEmail({
      to: claimantEmail,
      founderName: claimantName,
      startupName: claim.startupName,
      tempPassword,
    });

    await claimRepository.updateStatus(
      claimId, 
      ClaimStatus.APPROVED, 
      reviewedByUserId, 
      adminNotes || 'Claim Verified'
    );

    return {
      claimId,
      status: ClaimStatus.APPROVED,
      startupId: claim.startupId,
      founderAccount: {
        email: claimantEmail,
        name: claimantName,
        tempPassword,
        isNewUser,
      },
    };
  }

  async rejectClaim(claimId: string, reviewedByUserId: string, reason: string) {
    const claim = await claimRepository.findById(claimId);
    if (!claim) {
      throw ApiError.notFound('Claim record not found');
    }

    await claimRepository.updateStatus(claimId, ClaimStatus.REJECTED, reviewedByUserId, reason || 'Claim identity could not be verified');

    return {
      claimId,
      status: ClaimStatus.REJECTED,
      reason,
    };
  }
}

export const claimService = new ClaimService();
