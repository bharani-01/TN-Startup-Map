import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../utils/constants.js';
import { ApiError } from '../utils/ApiError.js';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(`Access restricted to roles: ${allowedRoles.join(', ')}. Your role: ${req.user.role}`)
      );
    }

    next();
  };
};
