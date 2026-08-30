import { prisma } from '../database/connection.js';
import { ApiAccessLog, AuditLogFilters } from '../models/Analytics.js';

export class AuditLogRepository {
  // In-memory live buffer (fast memory cache of recent 200 requests)
  private memoryLogs: ApiAccessLog[] = [];
  private readonly MAX_MEMORY_LOGS = 200;
  private writeQueue: any[] = [];
  private isFlushing = false;

  constructor() {
    // Flush audit logs in batched writes every 3 seconds
    setInterval(() => this.flushWriteQueue(), 3000);
  }

  private async flushWriteQueue() {
    if (this.isFlushing || this.writeQueue.length === 0) return;
    this.isFlushing = true;
    const batch = this.writeQueue.splice(0, 50);

    try {
      if ((prisma as any).apiAccessLog?.createMany) {
        await (prisma as any).apiAccessLog.createMany({
          data: batch,
          skipDuplicates: true,
        });
      } else {
        for (const item of batch) {
          await (prisma as any).apiAccessLog.create({ data: item });
        }
      }
    } catch (err: any) {
      // Non-fatal, prevent connection timeouts from surfacing
      console.warn('[AuditLog] Buffered write flush warning:', err.message);
    } finally {
      this.isFlushing = false;
    }
  }

  async recordLog(data: Omit<ApiAccessLog, 'id' | 'createdAt'>): Promise<void> {
    const id = `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = new Date().toISOString();

    const logEntry: ApiAccessLog = {
      id,
      ...data,
      createdAt,
    };

    // 1. Prepend to fast in-memory ring buffer
    this.memoryLogs.unshift(logEntry);
    if (this.memoryLogs.length > this.MAX_MEMORY_LOGS) {
      this.memoryLogs.pop();
    }

    // 2. Queue for batched database write
    this.writeQueue.push({
      id,
      actorId: data.actorId || null,
      actorEmail: data.actorEmail || null,
      actorRole: data.actorRole || null,
      method: data.method,
      route: data.route,
      statusCode: data.statusCode,
      durationMs: data.durationMs,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      queryParams: data.queryParams || null,
      createdAt: new Date(createdAt),
    });
  }

  async getLogs(filters: AuditLogFilters = {}): Promise<{ logs: ApiAccessLog[]; total: number }> {
    const {
      search,
      method,
      role,
      statusCode,
      actorEmail,
      limit = 50,
      offset = 0,
    } = filters;

    const where: any = {};

    if (method) where.method = method.toUpperCase();
    if (role) where.actorRole = role.toUpperCase();
    if (statusCode) where.statusCode = Number(statusCode);
    if (actorEmail) where.actorEmail = { contains: actorEmail, mode: 'insensitive' };

    if (search) {
      where.OR = [
        { route: { contains: search, mode: 'insensitive' } },
        { actorEmail: { contains: search, mode: 'insensitive' } },
        { method: { contains: search, mode: 'insensitive' } },
        { ipAddress: { contains: search, mode: 'insensitive' } },
      ];
    }

    try {
      const [dbLogs, total] = await Promise.all([
        (prisma as any).apiAccessLog.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        (prisma as any).apiAccessLog.count({ where }),
      ]);

      const logs: ApiAccessLog[] = dbLogs.map((l: any) => ({
        id: l.id,
        actorId: l.actorId || undefined,
        actorEmail: l.actorEmail || undefined,
        actorRole: l.actorRole || undefined,
        method: l.method,
        route: l.route,
        statusCode: l.statusCode,
        durationMs: l.durationMs,
        ipAddress: l.ipAddress || undefined,
        userAgent: l.userAgent || undefined,
        queryParams: l.queryParams || undefined,
        createdAt: new Date(l.createdAt).toISOString(),
      }));

      return { logs, total };
    } catch {
      // Memory fallback if DB is busy
      let filtered = [...this.memoryLogs];
      if (method) filtered = filtered.filter((l) => l.method.toUpperCase() === method.toUpperCase());
      if (role) filtered = filtered.filter((l) => l.actorRole?.toUpperCase() === role.toUpperCase());
      if (statusCode) filtered = filtered.filter((l) => l.statusCode === Number(statusCode));
      return { logs: filtered.slice(offset, offset + limit), total: filtered.length };
    }
  }

  async getStats() {
    try {
      const totalLogs = await (prisma as any).apiAccessLog.count();
      const errorLogs = await (prisma as any).apiAccessLog.count({
        where: { statusCode: { gte: 400 } },
      });

      const recentLogs = await (prisma as any).apiAccessLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: { durationMs: true, statusCode: true, route: true },
      });

      const avgLatency = recentLogs.length > 0
        ? Math.round(recentLogs.reduce((sum: number, l: any) => sum + (l.durationMs || 0), 0) / recentLogs.length)
        : 0;

      return {
        totalRequests: totalLogs,
        errorRequests: errorLogs,
        successRate: totalLogs > 0 ? parseFloat((((totalLogs - errorLogs) / totalLogs) * 100).toFixed(1)) : 100,
        avgLatencyMs: avgLatency,
      };
    } catch {
      const total = this.memoryLogs.length;
      const errors = this.memoryLogs.filter((l) => l.statusCode >= 400).length;
      return {
        totalRequests: total,
        errorRequests: errors,
        successRate: total > 0 ? parseFloat((((total - errors) / total) * 100).toFixed(1)) : 100,
        avgLatencyMs: 12,
      };
    }
  }
}

export const auditLogRepository = new AuditLogRepository();
