import { Request, Response, NextFunction } from 'express';
import { analyticsRepository } from '../repositories/AnalyticsRepository.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { ApiError } from '../utils/ApiError.js';

export class AnalyticsController {
  // POST /api/analytics/track — Public telemetry collector
  async trackEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventType, entityType, entityId, targetUrl, referrer, metadata } = req.body;

      if (!eventType || !entityType || !entityId) {
        return res.status(HTTP_STATUS.OK).json(ApiResponse.success(null, 'Ignored invalid event'));
      }

      const user = (req as any).user;
      const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
      const ipAddress = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : Array.isArray(rawIp) ? rawIp[0] : '';

      const recorded = await analyticsRepository.recordEvent(
        {
          eventType,
          entityType,
          entityId,
          targetUrl,
          referrer,
          metadata,
        },
        user?.id,
        user?.email,
        ipAddress
      );

      res.status(HTTP_STATUS.OK).json(ApiResponse.success(recorded, 'Event recorded'));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/founder/analytics/:startupId or GET /api/admin/startups/:id/analytics
  async getStartupAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const rawStartupId = req.params.id || req.params.startupId;
      const startupId = Array.isArray(rawStartupId) ? rawStartupId[0] : rawStartupId;
      const days = parseInt(req.query.days as string) || 30;

      if (!startupId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(ApiResponse.error('Startup ID or slug is required'));
      }

      const metrics = await analyticsRepository.getStartupMetrics(startupId, days);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(metrics));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/admin/analytics — ADMIN only
  async getEcosystemAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const metrics = await analyticsRepository.getEcosystemMetrics(days);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(metrics));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/admin/analytics/startups-views — ADMIN only
  async getAllStartupsViews(req: Request, res: Response, next: NextFunction) {
    try {
      const viewsMap = await analyticsRepository.getAllStartupsViewCounts();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(viewsMap));
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
