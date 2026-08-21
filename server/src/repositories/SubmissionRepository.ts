import { db, prisma } from '../database/connection.js';
import { Submission } from '../models/Submission.js';
import { SubmissionStatus } from '../utils/constants.js';
import { generatePublicId } from '../utils/publicId.js';

export class SubmissionRepository {
  async create(submission: Submission): Promise<Submission> {
    const subToSave: Submission = {
      ...submission,
      publicId: submission.publicId || generatePublicId('sub'),
    };
    db.submissions.set(subToSave.id, subToSave);
    return subToSave;
  }

  async findById(id: string): Promise<Submission | null> {
    let sub = db.submissions.get(id);
    if (!sub) {
      sub = Array.from(db.submissions.values()).find((s) => s.publicId === id || s.id === id);
    }
    return sub || null;
  }

  async findAll(status?: SubmissionStatus): Promise<Submission[]> {
    let list = Array.from(db.submissions.values());
    if (status) {
      list = list.filter((s) => s.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateStatus(id: string, status: SubmissionStatus, reviewedByUserId?: string, adminNotes?: string): Promise<Submission | null> {
    let sub = db.submissions.get(id);
    if (!sub) {
      sub = Array.from(db.submissions.values()).find((s) => s.publicId === id || s.id === id);
    }
    if (!sub) return null;

    sub.status = status;
    if (reviewedByUserId) sub.reviewedByUserId = reviewedByUserId;
    if (adminNotes) sub.adminNotes = adminNotes;
    sub.updatedAt = new Date().toISOString();

    db.submissions.set(sub.id, sub);
    return sub;
  }
}

export const submissionRepository = new SubmissionRepository();
