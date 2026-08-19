import { Request, Response, NextFunction } from 'express';
import { claimService } from '../services/ClaimService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class ClaimController {
  async submitClaim(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const claim = await claimService.submitClaim(req.body, userId);
      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success(
          claim,
          'Claim request submitted successfully. The admin team will review your proof of association.'
        )
      );
    } catch (error) {
      next(error);
    }
  }
}

export const claimController = new ClaimController();
