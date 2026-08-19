import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/AuthService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(HTTP_STATUS.CREATED).json(ApiResponse.success(result, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(ApiResponse.error('Not authenticated'));
      }
      const user = await authService.getCurrentUser(req.user.id);
      res.status(HTTP_STATUS.OK).json(ApiResponse.success(user));
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
