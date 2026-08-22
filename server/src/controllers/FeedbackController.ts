import { Request, Response, NextFunction } from 'express';
import { feedbackRepository } from '../repositories/FeedbackRepository.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class FeedbackController {
  // POST /api/feedback — Public / Authenticated Ingestion
  async submitFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { rating, category, message, userEmail, pageUrl } = req.body;

      if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          ApiResponse.error('Rating must be an integer between 1 and 5')
        );
      }

      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const user = (req as any).user;

      const feedback = await feedbackRepository.create({
        rating,
        category,
        message: message?.trim() || undefined,
        userEmail: userEmail?.trim() || user?.email || undefined,
        userId: user?.id || undefined,
        pageUrl: pageUrl || undefined,
        userAgent,
        ipAddress: clientIp,
      });

      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(feedback, 'Thank you for your feedback!'));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/admin/feedback — Admin Only List
  async getAdminFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        rating: req.query.rating ? parseInt(req.query.rating as string) : undefined,
        category: req.query.category as any,
        isResolved: req.query.isResolved !== undefined ? req.query.isResolved === 'true' : undefined,
        search: req.query.search as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 30,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await feedbackRepository.getList(filters);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/admin/feedback/stats — Admin Only CSAT Analytics
  async getFeedbackStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await feedbackRepository.getStats();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(stats));
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/admin/feedback/:id — Admin Only Status Update
  async updateFeedbackStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { isResolved, adminNotes } = req.body;

      const updated = await feedbackRepository.updateResolution(id, isResolved, adminNotes);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(updated, 'Feedback updated successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export const feedbackController = new FeedbackController();
