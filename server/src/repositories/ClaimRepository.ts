import { db } from '../database/connection.js';
import { Claim } from '../models/Claim.js';
import { ClaimStatus } from '../utils/constants.js';

export class ClaimRepository {
  async create(claim: Claim): Promise<Claim> {
    db.claims.set(claim.id, claim);
    return claim;
  }

  async findById(id: string): Promise<Claim | null> {
    return db.claims.get(id) || null;
  }

  async findAll(status?: ClaimStatus): Promise<Claim[]> {
    let list = Array.from(db.claims.values());
    if (status) {
      list = list.filter((c) => c.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateStatus(id: string, status: ClaimStatus, reviewedByUserId?: string, adminNotes?: string): Promise<Claim | null> {
    const claim = db.claims.get(id);
    if (!claim) return null;

    claim.status = status;
    if (reviewedByUserId) claim.reviewedByUserId = reviewedByUserId;
    if (adminNotes) claim.adminNotes = adminNotes;
    claim.updatedAt = new Date().toISOString();

    db.claims.set(id, claim);
    return claim;
  }
}

export const claimRepository = new ClaimRepository();
