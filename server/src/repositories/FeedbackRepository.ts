import { prisma } from '../database/connection.js';
import { FeedbackCategory } from '@prisma/client';

export interface CreateFeedbackDTO {
  rating: number;
  category?: FeedbackCategory;
  message?: string;
  userEmail?: string;
  userId?: string;
  pageUrl?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface FeedbackFilterOptions {
  rating?: number;
  category?: FeedbackCategory;
  isResolved?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export class FeedbackRepository {
  async create(data: CreateFeedbackDTO) {
    return prisma.userFeedback.create({
      data: {
        rating: data.rating,
        category: data.category || 'GENERAL',
        message: data.message || null,
        userEmail: data.userEmail || null,
        userId: data.userId || null,
        pageUrl: data.pageUrl || null,
        userAgent: data.userAgent || null,
        ipAddress: data.ipAddress || null,
      },
    });
  }

  async getList(options: FeedbackFilterOptions = {}) {
    const { rating, category, isResolved, search, limit = 30, offset = 0 } = options;

    const where: any = {};

    if (rating !== undefined) {
      where.rating = rating;
    }
    if (category) {
      where.category = category;
    }
    if (isResolved !== undefined) {
      where.isResolved = isResolved;
    }
    if (search && search.trim()) {
      where.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { userEmail: { contains: search, mode: 'insensitive' } },
        { pageUrl: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [feedbacks, total] = await Promise.all([
      prisma.userFeedback.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              profile: {
                select: { displayName: true, avatarUrl: true },
              },
            },
          },
        },
      }),
      prisma.userFeedback.count({ where }),
    ]);

    return { feedbacks, total };
  }

  async getStats() {
    const [total, aggregateRating, categoryCounts, resolvedCount] = await Promise.all([
      prisma.userFeedback.count(),
      prisma.userFeedback.aggregate({
        _avg: { rating: true },
      }),
      prisma.userFeedback.groupBy({
        by: ['category'],
        _count: { id: true },
      }),
      prisma.userFeedback.count({
        where: { isResolved: true },
      }),
    ]);

    const avgRating = aggregateRating._avg.rating ? Number(aggregateRating._avg.rating.toFixed(2)) : 5.0;

    return {
      totalFeedback: total,
      averageRating: avgRating,
      resolvedCount,
      unresolvedCount: total - resolvedCount,
      categoryBreakdown: categoryCounts.map((c) => ({
        category: c.category,
        count: c._count.id,
      })),
    };
  }

  async updateResolution(id: string, isResolved: boolean, adminNotes?: string) {
    return prisma.userFeedback.update({
      where: { id },
      data: {
        isResolved,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      },
    });
  }
}

export const feedbackRepository = new FeedbackRepository();
