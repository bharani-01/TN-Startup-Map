export interface AuditLog {
  id: string; // UUID
  actorId?: string | null;
  actorEmail?: string | null;
  action: string; // e.g. "auth.login", "startup.create", "claim.approve"
  entityType: string;
  entityId?: string | null;
  oldValue?: Record<string, any> | null;
  newValue?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface CreateAuditLogDTO {
  actorId?: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}
