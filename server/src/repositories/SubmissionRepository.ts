import { db, prisma } from '../database/connection.js';
import { Submission } from '../models/Submission.js';
import { SubmissionStatus } from '../utils/constants.js';
import { generatePublicId } from '../utils/publicId.js';

export class SubmissionRepository {
  async create(submission: Submission): Promise<Submission> {
    const publicId = submission.publicId || generatePublicId('sub');
    const subToSave: Submission = {
      ...submission,
      publicId,
    };
    db.submissions.set(subToSave.id, subToSave);

    try {
      await (prisma as any).submission?.create({
        data: {
          id: subToSave.id,
          publicId: subToSave.publicId,
          data: subToSave.data as any,
          status: subToSave.status as any,
          submittedByEmail: subToSave.submittedByEmail,
          submittedByUserId: subToSave.submittedByUserId || undefined,
          createdAt: new Date(subToSave.createdAt),
          updatedAt: new Date(subToSave.updatedAt),
        },
      });
    } catch (err: any) {
      // Memory fallback active
    }

    return subToSave;
  }

  async findById(id: string): Promise<Submission | null> {
    let sub = db.submissions.get(id);
    if (!sub) {
      sub = Array.from(db.submissions.values()).find((s) => s.publicId === id || s.id === id);
    }
    if (sub) return sub;

    try {
      const dbSub = await (prisma as any).submission?.findFirst({
        where: { OR: [{ id }, { publicId: id }] },
      });
      if (dbSub) {
        const item: Submission = {
          id: dbSub.id,
          publicId: dbSub.publicId,
          data: dbSub.data as any,
          status: dbSub.status as any,
          submittedByEmail: dbSub.submittedByEmail,
          submittedByUserId: dbSub.submittedByUserId || undefined,
          createdAt: dbSub.createdAt ? new Date(dbSub.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: dbSub.updatedAt ? new Date(dbSub.updatedAt).toISOString() : new Date().toISOString(),
        };
        db.submissions.set(item.id, item);
        return item;
      }
    } catch {
      // Memory fallback
    }

    return null;
  }

  async findAll(status?: SubmissionStatus): Promise<Submission[]> {
    try {
      const dbSubs = await (prisma as any).submission?.findMany({
        where: status ? { status: status as any } : undefined,
        orderBy: { createdAt: 'desc' },
      });

      if (dbSubs && dbSubs.length > 0) {
        const list: Submission[] = dbSubs.map((dbSub: any) => ({
          id: dbSub.id,
          publicId: dbSub.publicId,
          data: dbSub.data as any,
          status: dbSub.status as any,
          submittedByEmail: dbSub.submittedByEmail,
          submittedByUserId: dbSub.submittedByUserId || undefined,
          createdAt: dbSub.createdAt ? new Date(dbSub.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: dbSub.updatedAt ? new Date(dbSub.updatedAt).toISOString() : new Date().toISOString(),
        }));
        list.forEach((s) => db.submissions.set(s.id, s));
        return list;
      }
    } catch {
      // Memory fallback
    }

    let list = Array.from(db.submissions.values());
    if (status) {
      list = list.filter((s) => s.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateStatus(id: string, status: SubmissionStatus, reviewedByUserId?: string, adminNotes?: string): Promise<Submission | null> {
    let sub = await this.findById(id);
    if (!sub) return null;

    sub.status = status;
    if (reviewedByUserId) sub.reviewedByUserId = reviewedByUserId;
    if (adminNotes) sub.adminNotes = adminNotes;
    sub.updatedAt = new Date().toISOString();

    db.submissions.set(sub.id, sub);

    try {
      await (prisma as any).submission?.update({
        where: { id: sub.id },
        data: {
          status: status as any,
          updatedAt: new Date(sub.updatedAt),
        },
      });

      if (reviewedByUserId) {
        await (prisma as any).submissionReview?.create({
          data: {
            submissionId: sub.id,
            reviewerUserId: reviewedByUserId,
            action: status === SubmissionStatus.APPROVED ? 'APPROVE' : 'REJECT',
            notes: adminNotes || undefined,
          },
        }).catch(() => {});
      }
    } catch {
      // Memory fallback
    }

    return sub;
  }
}

export const submissionRepository = new SubmissionRepository();
