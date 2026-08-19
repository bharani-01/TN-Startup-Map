import { Request, Response, NextFunction } from 'express';
import { submissionService } from '../services/SubmissionService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class SubmissionController {
  async submitStartup(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.user?.email;
      const userId = req.user?.id;
      const submission = await submissionService.submitStartup(req.body, userEmail, userId);
      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success(
          submission,
          'Startup submitted successfully. Your submission is now in PENDING_REVIEW and will be verified by the admin team.'
        )
      );
    } catch (error) {
      next(error);
    }
  }
}

export const submissionController = new SubmissionController();
