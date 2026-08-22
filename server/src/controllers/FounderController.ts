import { Request, Response, NextFunction } from 'express';
import { db } from '../database/connection.js';
import { userRepository } from '../repositories/UserRepository.js';
import { startupService } from '../services/StartupService.js';
import { isUserStartupOwner } from '../middleware/checkStartupOwnership.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS, UserRole } from '../utils/constants.js';

export class FounderController {
  /**
   * Returns ONLY the startups owned / claimed by the authenticated founder.
   * If the founder has no claimed startups, returns an empty array [].
   */
  async getMyStartups(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(ApiResponse.error('Authentication required'));
      }

      const fullUser = (await userRepository.findById(req.user.id)) || req.user;

      const allStartups = Array.from(db.startups.values()).filter((s) => !s.isDeleted);
      
      // Filter strictly by ownership
      const myStartups = allStartups.filter((st) => isUserStartupOwner(fullUser as any, st));

      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success({
          startups: myStartups,
          total: myStartups.length,
          hasRegisteredStartup: myStartups.length > 0,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves single startup profile with verified ownership guard
   */
  async getMyStartupDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const startup = (req as any).startup;
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(startup));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates founder startup profile with verified ownership guard
   */
  async updateMyStartup(req: Request, res: Response, next: NextFunction) {
    try {
      const currentStartup = (req as any).startup;
      const updated = await startupService.updateStartup(currentStartup.id, req.body);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(updated, 'Startup profile updated successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export const founderController = new FounderController();
