import { Request, Response, NextFunction } from 'express';
import { statsService } from '../services/StatsService.js';
import { submissionService } from '../services/SubmissionService.js';
import { claimService } from '../services/ClaimService.js';
import { startupService } from '../services/StartupService.js';
import { userRepository } from '../repositories/UserRepository.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS, UserRole } from '../utils/constants.js';

export class AdminController {
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await statsService.getEcosystemStats();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(stats));
    } catch (error) {
      next(error);
    }
  }

  async getSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as any;
      const submissions = await submissionService.getAllSubmissions(status);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(submissions));
    } catch (error) {
      next(error);
    }
  }

  async approveSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewerId = req.user?.id || 'admin';
      const result = await submissionService.approveSubmission(String(req.params.id), reviewerId, req.body.adminNotes);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(result, 'Submission approved and startup published'));
    } catch (error) {
      next(error);
    }
  }

  async rejectSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewerId = req.user?.id || 'admin';
      const result = await submissionService.rejectSubmission(String(req.params.id), reviewerId, req.body.reason);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(result, 'Submission rejected'));
    } catch (error) {
      next(error);
    }
  }

  async getClaims(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as any;
      const claims = await claimService.getAllClaims(status);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(claims));
    } catch (error) {
      next(error);
    }
  }

  async approveClaim(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewerId = req.user?.id || 'admin';
      const result = await claimService.approveClaim(String(req.params.id), reviewerId, req.body.adminNotes);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(result, 'Claim verified and startup ownership assigned'));
    } catch (error) {
      next(error);
    }
  }

  async rejectClaim(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewerId = req.user?.id || 'admin';
      const result = await claimService.rejectClaim(String(req.params.id), reviewerId, req.body.reason);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(result, 'Claim rejected'));
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userRepository.findAll();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(users));
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req.body;
      if (!Object.values(UserRole).includes(role)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(ApiResponse.error('Invalid user role'));
      }
      const user = await userRepository.updateRole(String(req.params.id), role);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(user, 'User role updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async syncDatabase(req: Request, res: Response, next: NextFunction) {
    try {
      const { db } = await import('../database/connection.js');
      await db.syncFromDatabase();
      const stats = await statsService.getEcosystemStats();
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(stats, 'In-memory spatial cache synchronized with PostgreSQL database successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
