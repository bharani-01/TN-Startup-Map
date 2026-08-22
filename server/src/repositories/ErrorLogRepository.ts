import { prisma } from '../database/connection.js';
import { ErrorSeverity, ErrorSource } from '@prisma/client';

export interface CreateErrorLogDTO {
  source?: ErrorSource;
  severity?: ErrorSeverity;
  message: string;
  stackTrace?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  actorEmail?: string;
  actorRole?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ErrorFilterOptions {
  source?: ErrorSource;
  severity?: ErrorSeverity;
  isResolved?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export class ErrorLogRepository {
  private memoryErrors: Array<CreateErrorLogDTO & { id: string; createdAt: Date }> = [];
  private readonly MAX_MEMORY_ERRORS = 100;

  async recordError(data: CreateErrorLogDTO): Promise<void> {
    const memoryItem = {
      id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...data,
      createdAt: new Date(),
    };

    this.memoryErrors.unshift(memoryItem);
    if (this.memoryErrors.length > this.MAX_MEMORY_ERRORS) {
      this.memoryErrors.pop();
    }

    try {
      await prisma.systemErrorLog.create({
        data: {
          source: data.source || 'BACKEND',
          severity: data.severity || 'ERROR',
          message: data.message.substring(0, 5000),
          stackTrace: data.stackTrace || null,
          route: data.route || null,
          method: data.method || null,
          statusCode: data.statusCode || null,
          actorEmail: data.actorEmail || null,
          actorRole: data.actorRole || null,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
        },
      });
    } catch (err) {
      // Non-blocking fallback
      console.error('[ErrorLogRepository] Failed to write error log to PostgreSQL:', err);
    }
  }

  async getList(options: ErrorFilterOptions = {}) {
    const { source, severity, isResolved, search, limit = 40, offset = 0 } = options;

    const where: any = {};

    if (source) {
      where.source = source;
    }
    if (severity) {
      where.severity = severity;
    }
    if (isResolved !== undefined) {
      where.isResolved = isResolved;
    }
    if (search && search.trim()) {
      where.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { route: { contains: search, mode: 'insensitive' } },
        { stackTrace: { contains: search, mode: 'insensitive' } },
        { actorEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [errors, total] = await Promise.all([
      prisma.systemErrorLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.systemErrorLog.count({ where }),
    ]);

    return { errors, total };
  }

  async getStats() {
    const [total, criticalCount, warningCount, resolvedCount, backendCount, frontendCount] = await Promise.all([
      prisma.systemErrorLog.count(),
      prisma.systemErrorLog.count({ where: { severity: 'CRITICAL' } }),
      prisma.systemErrorLog.count({ where: { severity: 'WARNING' } }),
      prisma.systemErrorLog.count({ where: { isResolved: true } }),
      prisma.systemErrorLog.count({ where: { source: 'BACKEND' } }),
      prisma.systemErrorLog.count({ where: { source: 'FRONTEND' } }),
    ]);

    return {
      totalErrors: total,
      criticalErrors: criticalCount,
      warningErrors: warningCount,
      resolvedErrors: resolvedCount,
      unresolvedErrors: total - resolvedCount,
      backendErrors: backendCount,
      frontendErrors: frontendCount,
    };
  }

  async updateResolution(id: string, isResolved: boolean, adminNotes?: string) {
    return prisma.systemErrorLog.update({
      where: { id },
      data: {
        isResolved,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      },
    });
  }
}

export const errorLogRepository = new ErrorLogRepository();
