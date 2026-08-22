import { db, prisma } from '../database/connection.js';
import { Claim } from '../models/Claim.js';
import { ClaimStatus } from '../utils/constants.js';
import { generatePublicId } from '../utils/publicId.js';

export class ClaimRepository {
  async create(claim: Claim): Promise<Claim> {
    const publicId = claim.publicId || generatePublicId('clm');
    const claimToSave: Claim = {
      ...claim,
      publicId,
    };
    db.claims.set(claimToSave.id, claimToSave);

    try {
      // 1. Resolve startup in database
      const dbStartup = await (prisma as any).startup?.findFirst({
        where: {
          OR: [
            { id: claimToSave.startupId },
            { publicId: claimToSave.startupId },
            { slug: claimToSave.startupSlug || claimToSave.startupId },
          ],
        },
      });

      if (dbStartup) {
        await (prisma as any).claim?.create({
          data: {
            id: claimToSave.id,
            publicId: claimToSave.publicId,
            startupId: dbStartup.id,
            claimantName: claimToSave.claimantName,
            claimantEmail: claimToSave.claimantEmail,
            claimantRole: claimToSave.claimantRole,
            status: claimToSave.status as any,
            userAccountId: claimToSave.userId || undefined,
            createdAt: new Date(claimToSave.createdAt),
            updatedAt: new Date(claimToSave.updatedAt),
            evidence: claimToSave.proofDetails
              ? {
                  create: {
                    evidenceType: 'OTHER',
                    description: claimToSave.proofDetails,
                  },
                }
              : undefined,
          },
        });
      }
    } catch {
      // Memory fallback
    }

    return claimToSave;
  }

  async findById(id: string): Promise<Claim | null> {
    let claim = db.claims.get(id);
    if (!claim) {
      claim = Array.from(db.claims.values()).find((c) => c.publicId === id || c.id === id);
    }
    if (claim) return claim;

    try {
      const dbCl = await (prisma as any).claim?.findFirst({
        where: { OR: [{ id }, { publicId: id }] },
        include: { evidence: true, startup: true },
      });
      if (dbCl) {
        const item: Claim = {
          id: dbCl.id,
          publicId: dbCl.publicId,
          startupId: dbCl.startupId,
          startupSlug: dbCl.startup?.slug || '',
          startupName: dbCl.startup?.name || '',
          claimantName: dbCl.claimantName,
          claimantEmail: dbCl.claimantEmail,
          claimantRole: dbCl.claimantRole,
          proofDetails: dbCl.evidence?.[0]?.description || '',
          status: dbCl.status as any,
          userId: dbCl.userAccountId || undefined,
          userAccountId: dbCl.userAccountId || undefined,
          createdAt: dbCl.createdAt ? new Date(dbCl.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: dbCl.updatedAt ? new Date(dbCl.updatedAt).toISOString() : new Date().toISOString(),
        };
        db.claims.set(item.id, item);
        return item;
      }
    } catch {
      // Memory fallback
    }

    return null;
  }

  async findAll(status?: ClaimStatus): Promise<Claim[]> {
    try {
      const dbClaims = await (prisma as any).claim?.findMany({
        where: status ? { status: status as any } : undefined,
        include: { evidence: true, startup: true },
        orderBy: { createdAt: 'desc' },
      });

      if (dbClaims && dbClaims.length > 0) {
        dbClaims.forEach((dbCl: any) => {
          const item: Claim = {
            id: dbCl.id,
            publicId: dbCl.publicId,
            startupId: dbCl.startupId,
            startupSlug: dbCl.startup?.slug || '',
            startupName: dbCl.startup?.name || '',
            claimantName: dbCl.claimantName,
            claimantEmail: dbCl.claimantEmail,
            claimantRole: dbCl.claimantRole,
            proofDetails: dbCl.evidence?.[0]?.description || '',
            status: dbCl.status as any,
            userId: dbCl.userAccountId || undefined,
            userAccountId: dbCl.userAccountId || undefined,
            createdAt: dbCl.createdAt ? new Date(dbCl.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: dbCl.updatedAt ? new Date(dbCl.updatedAt).toISOString() : new Date().toISOString(),
          };
          db.claims.set(item.id, item);
        });
      }
    } catch {
      // Memory fallback
    }

    let list = Array.from(db.claims.values());
    if (status) {
      list = list.filter((c) => c.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateStatus(id: string, status: ClaimStatus, reviewedByUserId?: string, adminNotes?: string): Promise<Claim | null> {
    let claim = await this.findById(id);
    if (!claim) return null;

    claim.status = status;
    if (reviewedByUserId) claim.reviewedByUserId = reviewedByUserId;
    if (adminNotes) claim.adminNotes = adminNotes;
    claim.updatedAt = new Date().toISOString();

    db.claims.set(claim.id, claim);

    try {
      await (prisma as any).claim?.update({
        where: { id: claim.id },
        data: {
          status: status as any,
          updatedAt: new Date(claim.updatedAt),
        },
      });
    } catch {
      // Memory fallback
    }

    return claim;
  }
}

export const claimRepository = new ClaimRepository();
