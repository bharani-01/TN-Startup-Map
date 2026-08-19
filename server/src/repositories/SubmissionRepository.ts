import { db } from '../database/connection.js';
import { Submission } from '../models/Submission.js';
import { SubmissionStatus } from '../utils/constants.js';

export class SubmissionRepository {
  async create(submission: Submission): Promise<Submission> {
    db.submissions.set(submission.id, submission);
    return submission;
  }

  async findById(id: string): Promise<Submission | null> {
    return db.submissions.get(id) || null;
  }

  async findAll(status?: SubmissionStatus): Promise<Submission[]> {
    let list = Array.from(db.submissions.values());
    if (status) {
      list = list.filter((s) => s.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateStatus(id: string, status: SubmissionStatus, reviewedByUserId?: string, adminNotes?: string): Promise<Submission | null> {
    const sub = db.submissions.get(id);
    if (!sub) return null;

    sub.status = status;
    if (reviewedByUserId) sub.reviewedByUserId = reviewedByUserId;
    if (adminNotes) sub.adminNotes = adminNotes;
    sub.updatedAt = new Date().toISOString();

    db.submissions.set(id, sub);
    return sub;
  }
}

export const submissionRepository = new SubmissionRepository();
