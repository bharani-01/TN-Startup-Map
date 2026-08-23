import { startupRepository } from '../repositories/StartupRepository.js';
import { districtRepository } from '../repositories/DistrictRepository.js';
import { userRepository } from '../repositories/UserRepository.js';
import { Startup, StartupFilterQuery } from '../models/Startup.js';
import { ApiError } from '../utils/ApiError.js';
import { slugify } from '../utils/slugify.js';
import { UserRole } from '../utils/constants.js';

export class StartupService {
  async getStartups(filters: StartupFilterQuery) {
    return startupRepository.findAll(filters);
  }

  async getStartupBySlug(slug: string): Promise<Startup> {
    let startup = await startupRepository.findBySlug(slug);
    if (!startup) {
      startup = await startupRepository.findById(slug);
    }
    if (!startup) {
      throw ApiError.notFound(`Startup '${slug}' not found in Tamil Nadu ecosystem directory`);
    }
    return startup;
  }

  async getRecentStartups(limit: number = 6): Promise<Startup[]> {
    return startupRepository.findRecent(limit);
  }

  async getRecentlyFundedStartups(limit: number = 6): Promise<Array<{ startup: Startup; round: Startup['fundingRounds'][0] }>> {
    return startupRepository.findRecentlyFunded(limit);
  }

  async getTrendingStartups(limit: number = 8): Promise<Startup[]> {
    return startupRepository.findTrending(limit);
  }

  async getNearbyStartups(lat: number, lng: number, radiusKm: number = 50) {
    if (isNaN(lat) || isNaN(lng)) {
      throw ApiError.badRequest('Valid latitude and longitude coordinates are required for nearby query');
    }
    return startupRepository.findNearby(lat, lng, radiusKm);
  }

  async getMapGeoJSON() {
    return startupRepository.getMapGeoJSON();
  }

  async createStartup(data: Partial<Startup>): Promise<Startup> {
    const name = data.name?.trim();
    if (!name) {
      throw ApiError.badRequest('Startup name is required');
    }

    let slug = slugify(name);
    let existing = await startupRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Find district coordinates if not supplied or invalid
    let lat = data.latitude !== undefined && data.latitude !== null ? (typeof data.latitude === 'string' ? parseFloat(data.latitude) : data.latitude) : undefined;
    let lng = data.longitude !== undefined && data.longitude !== null ? (typeof data.longitude === 'string' ? parseFloat(data.longitude) : data.longitude) : undefined;
    let districtName = data.district || 'Chennai';
    let districtSlug = slugify(districtName);

    const distObj = await districtRepository.findBySlug(districtSlug);
    if (distObj) {
      lat = lat !== undefined && !isNaN(lat) ? lat : distObj.latitude;
      lng = lng !== undefined && !isNaN(lng) ? lng : distObj.longitude;
      districtName = distObj.name;
    } else {
      lat = lat !== undefined && !isNaN(lat) ? lat : 13.0827;
      lng = lng !== undefined && !isNaN(lng) ? lng : 80.2707;
    }

    const newStartup: Startup = {
      id: `stp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      slug,
      name,
      tagline: data.tagline || '',
      description: data.description || '',
      extendedBio: data.extendedBio || '',
      website: data.website || '',
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      address: data.address,
      pincode: data.pincode,
      logoUrl: data.logoUrl,
      bannerUrl: data.bannerUrl,
      brandColor: data.brandColor,
      linkedin: data.linkedin,
      twitter: data.twitter,
      github: data.github,
      socialLinks: data.socialLinks || {},
      foundedYear: data.foundedYear || new Date().getFullYear(),
      stage: data.stage || 'Seed',
      fundingType: data.fundingType || 'Bootstrapped',
      totalFundingInr: data.totalFundingInr,
      totalFundingUsd: data.totalFundingUsd,
      teamSize: data.teamSize || '1-10',
      district: districtName,
      districtSlug,
      city: data.city || districtName,
      latitude: lat,
      longitude: lng,
      sectors: data.sectors && data.sectors.length ? data.sectors : ['SaaS'],
      techStack: data.techStack || [],
      galleryImages: data.galleryImages || [],
      posts: data.posts || [],
      customSections: data.customSections || [],
      founders: data.founders || [],
      fundingRounds: data.fundingRounds || [],
      verificationStatus: data.verificationStatus || ('VERIFIED' as any),
      source: data.source || 'Admin Verified',
      sourceUrl: data.sourceUrl,
      lastVerifiedAt: new Date().toISOString(),
      trendingScore: data.trendingScore || 70,
      isHiring: data.isHiring || false,
      isDeleted: false,
      deletedAt: null,
      deletedByUserId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return startupRepository.create(newStartup);
  }

  async updateStartup(id: string, updates: Partial<Startup>): Promise<Startup> {
    const updated = await startupRepository.update(id, updates);
    if (!updated) {
      throw ApiError.notFound('Startup not found for update');
    }
    return updated;
  }

  // Soft Delete (Safe & Non-Destructive)
  async deleteStartup(id: string, deletedByUserId?: string): Promise<boolean> {
    const deleted = await startupRepository.delete(id, deletedByUserId);
    if (!deleted) {
      throw ApiError.notFound('Startup not found for soft-deletion');
    }
    return true;
  }

  // Restore Soft-Deleted Startup
  async restoreStartup(id: string): Promise<Startup> {
    const restored = await startupRepository.restore(id);
    if (!restored) {
      throw ApiError.notFound('Startup not found for restoration');
    }
    return restored;
  }

  // Transfer Company Ownership
  async transferOwnership(startupId: string, fromUserId: string, targetEmail: string): Promise<{ startup: Startup; targetUser: any }> {
    const cleanEmail = targetEmail.trim().toLowerCase();
    const targetUser = await userRepository.findByEmail(cleanEmail);
    if (!targetUser) {
      throw ApiError.badRequest(`Target user with email "${cleanEmail}" was not found. Please ask them to sign up first.`);
    }

    const startup = await startupRepository.findById(startupId);
    if (!startup) {
      throw ApiError.notFound('Startup record not found');
    }

    // 1. Update Startup
    const updatedStartup = await startupRepository.update(startupId, {
      claimedByUserId: targetUser.id,
    });

    // 2. Add to target user's claimed startups
    const targetClaims = Array.isArray(targetUser.claimedStartupIds)
      ? targetUser.claimedStartupIds
      : (targetUser.claimedStartupId ? [targetUser.claimedStartupId] : []);
    const newTargetClaims = Array.from(new Set([...targetClaims, startupId]));

    await userRepository.update(targetUser.id, {
      role: targetUser.role === UserRole.ADMIN ? targetUser.role : UserRole.FOUNDER,
      companyName: targetUser.companyName || startup.name,
      claimedStartupId: targetUser.claimedStartupId || startupId,
      claimedStartupIds: newTargetClaims,
    });

    // 3. Remove from original user's claims
    const fromUser = await userRepository.findById(fromUserId);
    if (fromUser) {
      const fromClaims = (fromUser.claimedStartupIds || []).filter((id) => id !== startupId);
      await userRepository.update(fromUserId, {
        claimedStartupIds: fromClaims,
        claimedStartupId: fromClaims.length > 0 ? fromClaims[0] : undefined,
      });
    }

    return {
      startup: updatedStartup!,
      targetUser: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
      },
    };
  }
}

export const startupService = new StartupService();
