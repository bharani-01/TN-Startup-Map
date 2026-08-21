import { Request, Response, NextFunction } from 'express';
import { db } from '../database/connection.js';
import { CreateAuditLogDTO } from '../models/AuditLog.js';
import { logger } from '../utils/logger.js';

export async function logAuditEvent(entry: CreateAuditLogDTO): Promise<void> {
  try {
    await db.recordAuditLog(entry);
  } catch (err: any) {
    logger.error(`Failed to record audit log: ${err.message}`);
  }
}

/**
 * Express middleware to automatically capture state-modifying requests (POST, PUT, PATCH, DELETE)
 */
export function auditMiddleware(req: Request, res: Response, next: NextFunction) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const originalSend = res.send;
    const startTime = Date.now();

    res.send = function (body: any): Response {
      res.send = originalSend;
      const resResult = res.send(body);

      // Only log successful modifications
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const user = (req as any).user;
        const action = `${req.method.toLowerCase()}.${req.baseUrl || ''}${req.path}`.replace(/\/+/g, '.');

        logAuditEvent({
          actorId: user?.id,
          actorEmail: user?.email,
          action,
          entityType: req.baseUrl?.replace('/api/', '') || 'resource',
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'] as string,
          metadata: {
            method: req.method,
            path: req.originalUrl,
            durationMs: Date.now() - startTime,
            statusCode: res.statusCode,
          },
        }).catch(() => {});
      }

      return resResult;
    };
  }

  next();
}
