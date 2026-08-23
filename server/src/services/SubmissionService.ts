import bcrypt from 'bcryptjs';
import { submissionRepository } from '../repositories/SubmissionRepository.js';
import { userRepository } from '../repositories/UserRepository.js';
import { startupService } from './StartupService.js';
import { emailService } from './EmailService.js';
import { StartupSubmissionDTO, Submission } from '../models/Submission.js';
import { generateInternalUserId } from '../models/User.js';
import { SubmissionStatus, VerificationStatus, UserRole } from '../utils/constants.js';
import { ApiError } from '../utils/ApiError.js';
import { generatePublicId } from '../utils/publicId.js';

export class SubmissionService {
  async submitStartup(data: StartupSubmissionDTO, userEmail?: string, userId?: string): Promise<Submission> {
    if (!data.name || !data.website || !data.district || !data.founderName || !data.founderEmail) {
      throw ApiError.badRequest('Required fields missing: name, website, district, founder name, founder email are mandatory');
    }

    const newSub: Submission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      publicId: generatePublicId('sub'),
      data,
      status: SubmissionStatus.PENDING_REVIEW,
      submittedByEmail: userEmail || data.founderEmail,
      submittedByUserId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return submissionRepository.create(newSub);
  }

  async getPendingSubmissions(): Promise<Submission[]> {
    return submissionRepository.findAll(SubmissionStatus.PENDING_REVIEW);
  }

  async getAllSubmissions(status?: SubmissionStatus): Promise<Submission[]> {
    return submissionRepository.findAll(status);
  }

  async approveSubmission(submissionId: string, reviewedByUserId: string, adminNotes?: string) {
    const submission = await submissionRepository.findById(submissionId);
    if (!submission) {
      throw ApiError.notFound('Submission record not found');
    }

    if (submission.status !== SubmissionStatus.PENDING_REVIEW) {
      throw ApiError.badRequest(`Submission is already in status: ${submission.status}`);
    }

    const subData = submission.data;
    const founderEmail = subData.founderEmail.trim().toLowerCase();
    const founderName = subData.founderName.trim();

    // 1. Create the active startup record
    const createdStartup = await startupService.createStartup({
      name: subData.name,
      tagline: subData.tagline || `${subData.name} - Innovating in ${subData.district}, Tamil Nadu`,
      description: subData.description || `${subData.name} is a high-growth startup founded in ${subData.city}, ${subData.district}.`,
      website: subData.website,
      district: subData.district,
      city: subData.city,
      address: subData.address,
      pincode: subData.pincode,
      latitude: subData.latitude ? (typeof subData.latitude === 'string' ? parseFloat(subData.latitude) : subData.latitude) : undefined,
      longitude: subData.longitude ? (typeof subData.longitude === 'string' ? parseFloat(subData.longitude) : subData.longitude) : undefined,
      sectors: subData.sectors,
      foundedYear: subData.foundedYear,
      stage: subData.stage,
      fundingType: subData.fundingType,
      teamSize: subData.teamSize || '1-10',
      linkedin: subData.linkedin,
      logoUrl: subData.logoUrl,
      contactEmail: founderEmail,
      founders: [
        {
          name: founderName,
          role: 'Founder & CEO',
          email: founderEmail,
          linkedin: subData.founderLinkedin,
        },
      ],
      verificationStatus: VerificationStatus.VERIFIED,
      source: 'Verified Platform Submission',
      sourceUrl: subData.sourceUrl || subData.website,
      trendingScore: 75,
    });

    // 2. Provision or Link Founder Account
    const existingUser = await userRepository.findByEmail(founderEmail);
    let isNewUser = false;
    let tempPassword = '';
    let founderUserId = '';

    if (existingUser) {
      isNewUser = false;
      founderUserId = existingUser.id;
      const existingClaims = Array.isArray(existingUser.claimedStartupIds)
        ? existingUser.claimedStartupIds
        : (existingUser.claimedStartupId ? [existingUser.claimedStartupId] : []);
      
      const updatedClaims = Array.from(new Set([...existingClaims, createdStartup.id]));

      await userRepository.update(existingUser.id, {
        role: (existingUser.role === UserRole.ADMIN || existingUser.role === UserRole.SUPER_ADMIN) ? existingUser.role : UserRole.FOUNDER,
        companyName: existingUser.companyName || createdStartup.name,
        claimedStartupId: existingUser.claimedStartupId || createdStartup.id,
        claimedStartupIds: updatedClaims,
      });

      // Send update email without temporary password
      await emailService.sendFounderWelcomeEmail({
        to: founderEmail,
        founderName,
        startupName: createdStartup.name,
        isExistingUser: true,
      });
    } else {
      isNewUser = true;
      tempPassword = emailService.generateTempPassword();
      const passwordHash = await bcrypt.hash(tempPassword, 10);
      const userId = generateInternalUserId();
      const publicId = generatePublicId('usr');
      founderUserId = userId;

      const newUser = {
        id: userId,
        publicId,
        displayId: publicId,
        email: founderEmail,
        name: founderName,
        role: UserRole.FOUNDER,
        companyName: createdStartup.name,
        claimedStartupId: createdStartup.id,
        claimedStartupIds: [createdStartup.id],
        passwordHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await userRepository.create(newUser);

      // Dispatch Notification Email with Credentials
      await emailService.sendFounderWelcomeEmail({
        to: founderEmail,
        founderName,
        startupName: createdStartup.name,
        tempPassword,
        isExistingUser: false,
      });
    }

    // 3. Link founder user account ID and ensure VERIFIED status on startup
    const finalStartup = await startupService.updateStartup(createdStartup.id, {
      claimedByUserId: founderUserId,
      contactEmail: founderEmail,
      verificationStatus: VerificationStatus.VERIFIED,
    });

    // 4. Update submission status
    const updatedSubmission = await submissionRepository.updateStatus(
      submissionId,
      SubmissionStatus.APPROVED,
      reviewedByUserId,
      adminNotes || 'Approved & Verified'
    );

    return {
      submission: updatedSubmission,
      startup: finalStartup || createdStartup,
      founderAccount: {
        email: founderEmail,
        name: founderName,
        isNewUser,
        tempPassword: isNewUser ? tempPassword : undefined,
      },
    };
  }

  async rejectSubmission(submissionId: string, reviewedByUserId: string, reason: string) {
    const submission = await submissionRepository.findById(submissionId);
    if (!submission) {
      throw ApiError.notFound('Submission record not found');
    }

    const updated = await submissionRepository.updateStatus(
      submissionId,
      SubmissionStatus.REJECTED,
      reviewedByUserId,
      reason || 'Submission does not meet listing criteria'
    );

    return updated;
  }
}

export const submissionService = new SubmissionService();
