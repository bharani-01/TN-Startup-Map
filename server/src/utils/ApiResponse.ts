export interface ApiResponsePayload<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: Record<string, any>;
  timestamp: string;
}

export class ApiResponse {
  static success<T>(data: T, message?: string, meta?: Record<string, any>): ApiResponsePayload<T> {
    return {
      success: true,
      ...(message && { message }),
      data,
      ...(meta && { meta }),
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string, errors: any[] = []): { success: boolean; message: string; errors: any[]; timestamp: string } {
    return {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };
  }
}
