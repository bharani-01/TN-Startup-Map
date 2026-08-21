export type NotificationType = 
  | 'CLAIM_APPROVED'
  | 'CLAIM_REJECTED'
  | 'SUBMISSION_APPROVED'
  | 'SUBMISSION_REJECTED'
  | 'NEW_BLOG_COMMENT'
  | 'SYSTEM_ANNOUNCEMENT';

export interface Notification {
  id: string;
  publicId: string;
  recipientUserId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}
