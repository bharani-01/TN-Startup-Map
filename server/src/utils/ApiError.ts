import { HTTP_STATUS } from './constants.js';

export class ApiError extends Error {
  public statusCode: number;
  public errors: any[];
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message: string = 'Something went wrong',
    errors: any[] = [],
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors: any[] = []): ApiError {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, errors);
  }

  static unauthorized(message: string = 'Authentication required'): ApiError {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(message: string = 'You do not have permission to perform this action'): ApiError {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message);
  }

  static conflict(message: string): ApiError {
    return new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  static internal(message: string = 'Internal server error'): ApiError {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, [], false);
  }
}
