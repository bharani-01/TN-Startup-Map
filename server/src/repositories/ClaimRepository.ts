import { db, prisma } from '../database/connection.js';
import { Claim } from '../models/Claim.js';
import { ClaimStatus } from '../utils/constants.js';
import { generatePublicId } from '../utils/publicId.js';

export class ClaimRepository {
  async create(claim: Claim): Promise<Claim> {
    const claimToSave: Claim = {
      ...claim,
      publicId: claim.publicId || generatePublicId('clm'),
    };
    db.claims.set(claimToSave.id, claimToSave);
    return claimToSave;
  }

  async findById(id: string): Promise<Claim | null> {
    let claim = db.claims.get(id);
    if (!claim) {
      claim = Array.from(db.claims.values()).find((c) => c.publicId === id || c.id === id);
    }
    return claim || null;
  }

  async findAll(status?: ClaimStatus): Promise<Claim[]> {
    let list = Array.from(db.claims.values());
    if (status) {
      list = list.filter((c) => c.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateStatus(id: string, status: ClaimStatus, reviewedByUserId?: string, adminNotes?: string): Promise<Claim | null> {
    let claim = db.claims.get(id);
    if (!claim) {
      claim = Array.from(db.claims.values()).find((c) => c.publicId === id || c.id === id);
    }
    if (!claim) return null;

    claim.status = status;
    if (reviewedByUserId) claim.reviewedByUserId = reviewedByUserId;
    if (adminNotes) claim.adminNotes = adminNotes;
    claim.updatedAt = new Date().toISOString();

    db.claims.set(claim.id, claim);
    return claim;
  }
}

export const claimRepository = new ClaimRepository();
