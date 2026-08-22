import { Request, Response, NextFunction } from 'express';
import { auditLogRepository } from '../repositories/AuditLogRepository.js';

export function apiAuditLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  // Listen for response completion event
  res.on('finish', () => {
    try {
      const durationMs = Date.now() - startTime;
      const user = (req as any).user;

      // Extract client IP
      const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
      const ipAddress = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : Array.isArray(rawIp) ? rawIp[0] : '';

      const userAgent = (req.headers['user-agent'] || '').substring(0, 255);

      // Clean route path (ignore query string in route name for clean grouping)
      const cleanRoute = req.originalUrl.split('?')[0];

      // Sanitize query params (exclude passwords/tokens)
      const sanitizedQuery: any = { ...req.query };
      delete sanitizedQuery.password;
      delete sanitizedQuery.token;
      delete sanitizedQuery.secret;

      // Record asynchronously
      auditLogRepository.recordLog({
        actorId: user?.id || undefined,
        actorEmail: user?.email || (user ? 'Authenticated User' : 'Anonymous Guest'),
        actorRole: user?.role || 'ANONYMOUS',
        method: req.method,
        route: cleanRoute,
        statusCode: res.statusCode,
        durationMs,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
        queryParams: Object.keys(sanitizedQuery).length > 0 ? sanitizedQuery : undefined,
      });
    } catch (err) {
      console.error('[apiAuditLogger] Error logging request:', err);
    }
  });

  next();
}
