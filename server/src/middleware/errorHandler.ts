import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { logger } from '../utils/logger.js';
import { errorLogRepository } from '../repositories/ErrorLogRepository.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  const isServerException = statusCode >= 500 || !(err instanceof ApiError);

  if (isServerException) {
    logger.error(`Unhandled Error on ${req.method} ${req.originalUrl}:`, err);

    // Asynchronously record backend error log to PostgreSQL
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress;
    const user = (req as any).user;

    errorLogRepository.recordError({
      source: 'BACKEND',
      severity: statusCode >= 500 ? 'CRITICAL' : 'ERROR',
      message: err.message || 'Internal Server Error',
      stackTrace: err.stack || undefined,
      route: req.originalUrl || req.path,
      method: req.method,
      statusCode,
      actorEmail: user?.email || undefined,
      actorRole: user?.role || undefined,
      ipAddress: clientIp,
      userAgent: req.headers['user-agent'],
    }).catch(() => {});
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
};
