import { Request, Response, NextFunction } from 'express';
import { startupRepository } from '../repositories/StartupRepository.js';
import { userRepository } from '../repositories/UserRepository.js';
import { ApiError } from '../utils/ApiError.js';
import { UserRole } from '../utils/constants.js';
import { Startup } from '../models/Startup.js';

export function isUserStartupOwner(
  user: {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
    publicId?: string;
    claimedStartupId?: string;
    claimedStartupIds?: string[];
  },
  startup: Startup
): boolean {
  if (!user) return false;

  // 1. System Admins have global administrative privileges
  if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  const userEmail = (user.email || '').toLowerCase().trim();
  const userName = (user.name || '').toLowerCase().trim();
  const startupId = (startup.id || '').toLowerCase();
  const startupSlug = (startup.slug || '').toLowerCase();
  const startupPublicId = (startup.publicId || '').toLowerCase();

  // 2. Startup was directly claimed by this user ID / public ID
  if (
    startup.claimedByUserId &&
    (startup.claimedByUserId === user.id || startup.claimedByUserId === user.publicId)
  ) {
    return true;
  }

  // 3. User's claimedStartupId or claimedStartupIds matches this startup ID/slug/publicId
  if (user.claimedStartupId) {
    const cid = user.claimedStartupId.toLowerCase();
    if (cid === startupId || cid === startupSlug || cid === startupPublicId) {
      return true;
    }
  }

  if (user.claimedStartupIds && Array.isArray(user.claimedStartupIds)) {
    const hasMatch = user.claimedStartupIds.some((cid) => {
      const lower = (cid || '').toLowerCase();
      return lower === startupId || lower === startupSlug || lower === startupPublicId;
    });
    if (hasMatch) return true;
  }

  // 4. Contact email matches founder's account email
  if (startup.contactEmail && startup.contactEmail.toLowerCase().trim() === userEmail) {
    return true;
  }

  // 5. Founder list contains an entry with matching email or matching verified name
  if (startup.founders && Array.isArray(startup.founders)) {
    const founderMatch = startup.founders.some((f: any) => {
      if (f.email && f.email.toLowerCase().trim() === userEmail) return true;
      if (f.name && f.name.toLowerCase().trim() === userName && user.role === UserRole.FOUNDER) return true;
      return false;
    });
    if (founderMatch) return true;
  }

  return false;
}

export const requireStartupOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required to access this startup resource.'));
    }

    const startupIdentifier = req.params.id || req.params.slug || req.body.startupId;
    if (!startupIdentifier) {
      return next(ApiError.badRequest('Startup ID or slug parameter is required.'));
    }

    // Look up startup by ID or slug
    let startup = await startupRepository.findById(startupIdentifier);
    if (!startup) {
      startup = await startupRepository.findBySlug(startupIdentifier);
    }

    if (!startup) {
      return next(ApiError.notFound(`Startup '${startupIdentifier}' not found in registry.`));
    }

    // Full user lookup to verify claimedStartupIds if token didn't contain it
    const fullUser = (await userRepository.findById(req.user.id)) || req.user;

    const isOwner = isUserStartupOwner(fullUser, startup);
    if (!isOwner) {
      return next(
        ApiError.forbidden(
          'Access Denied: You do not own this startup entity. Only the verified startup owner or ecosystem administrator is authorized to view or edit this profile.'
        )
      );
    }

    // Attach verified startup to request for controller efficiency
    (req as any).startup = startup;
    next();
  } catch (error) {
    next(error);
  }
};
