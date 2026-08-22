import { Request, Response, NextFunction } from 'express';
import { errorLogRepository } from '../repositories/ErrorLogRepository.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class ErrorLogController {
  // POST /api/telemetry/error — Public Ingestion of Client-Side Crashes
  async captureClientError(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, stackTrace, route, severity } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          ApiResponse.error('Error message is required')
        );
      }

      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const user = (req as any).user;

      await errorLogRepository.recordError({
        source: 'FRONTEND',
        severity: severity || 'ERROR',
        message,
        stackTrace,
        route,
        actorEmail: user?.email || undefined,
        actorRole: user?.role || undefined,
        ipAddress: clientIp,
        userAgent,
      });

      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(null, 'Error telemetry logged'));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/admin/errors — Admin Only Error Feed
  async getAdminErrors(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        source: req.query.source as any,
        severity: req.query.severity as any,
        isResolved: req.query.isResolved !== undefined ? req.query.isResolved === 'true' : undefined,
        search: req.query.search as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 40,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await errorLogRepository.getList(filters);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/admin/errors/stats — Admin Only Error Summary Metrics
  async getErrorStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await errorLogRepository.getStats();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(stats));
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/admin/errors/:id — Admin Only Triage Status Update
  async updateErrorStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { isResolved, adminNotes } = req.body;

      const updated = await errorLogRepository.updateResolution(id, isResolved, adminNotes);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(updated, 'Error status updated'));
    } catch (error) {
      next(error);
    }
  }
}

export const errorLogController = new ErrorLogController();
