import { Request, Response, NextFunction } from 'express';
import { auditLogRepository } from '../repositories/AuditLogRepository.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class AuditLogController {
  // GET /api/admin/audit-logs — ADMIN only
  async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        search: req.query.search as string,
        method: req.query.method as string,
        role: req.query.role as string,
        statusCode: req.query.statusCode ? parseInt(req.query.statusCode as string) : undefined,
        actorEmail: req.query.actorEmail as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await auditLogRepository.getLogs(filters);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/admin/audit-logs/stats — ADMIN only
  async getAuditStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await auditLogRepository.getStats();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(stats));
    } catch (error) {
      next(error);
    }
  }
}

export const auditLogController = new AuditLogController();
