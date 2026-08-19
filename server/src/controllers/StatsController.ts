import { Request, Response, NextFunction } from 'express';
import { statsService } from '../services/StatsService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class StatsController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await statsService.getEcosystemStats();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(stats));
    } catch (error) {
      next(error);
    }
  }
}

export const statsController = new StatsController();
