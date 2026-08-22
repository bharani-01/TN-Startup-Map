import { prisma } from '../database/connection.js';
import { TrackEventDTO, StartupAnalyticsMetrics, AnalyticsEvent } from '../models/Analytics.js';

export class AnalyticsRepository {
  async recordEvent(
    data: TrackEventDTO,
    actorId?: string,
    actorEmail?: string,
    ipAddress?: string
  ): Promise<AnalyticsEvent> {
    const id = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const record = await (prisma as any).analyticsEvent.create({
      data: {
        id,
        eventType: data.eventType,
        entityType: data.entityType,
        entityId: data.entityId,
        targetUrl: data.targetUrl || null,
        actorId: actorId || null,
        actorEmail: actorEmail || null,
        ipAddress: ipAddress || null,
        referrer: data.referrer || null,
        metadata: data.metadata || null,
      },
    });

    return {
      id: record.id,
      eventType: record.eventType,
      entityType: record.entityType,
      entityId: record.entityId,
      targetUrl: record.targetUrl || undefined,
      actorId: record.actorId || undefined,
      actorEmail: record.actorEmail || undefined,
      ipAddress: record.ipAddress || undefined,
      referrer: record.referrer || undefined,
      metadata: record.metadata || undefined,
      createdAt: new Date(record.createdAt).toISOString(),
    };
  }

  async getStartupMetrics(startupIdOrSlug: string, days: number = 30): Promise<StartupAnalyticsMetrics> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    // 1. Resolve startup ID or slug
    const startup = await (prisma as any).startup.findFirst({
      where: {
        OR: [{ id: startupIdOrSlug }, { slug: startupIdOrSlug }],
      },
      select: { id: true, slug: true, name: true },
    });

    const targetIds = startup ? [startup.id, startup.slug] : [startupIdOrSlug];

    // 2. Fetch events matching startup ID or slug
    const events = await (prisma as any).analyticsEvent.findMany({
      where: {
        entityId: { in: targetIds },
        createdAt: { gte: sinceDate },
      },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    // 3. Aggregate counts
    let totalViews = 0;
    let websiteClicks = 0;
    let applyClicks = 0;
    let pitchDeckClicks = 0;
    let socialClicks = 0;

    const dailyMap = new Map<string, { views: number; clicks: number }>();

    // Pre-populate last 7 days so chart is never empty
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap.set(key, { views: 0, clicks: 0 });
    }

    events.forEach((evt: any) => {
      const dateKey = new Date(evt.createdAt).toISOString().split('T')[0];
      const daily = dailyMap.get(dateKey) || { views: 0, clicks: 0 };

      if (evt.eventType === 'PAGE_VIEW') {
        totalViews++;
        daily.views++;
      } else if (evt.eventType === 'WEBSITE_CLICK') {
        websiteClicks++;
        daily.clicks++;
      } else if (evt.eventType === 'APPLY_CLICK') {
        applyClicks++;
        daily.clicks++;
      } else if (evt.eventType === 'PITCH_DECK_CLICK') {
        pitchDeckClicks++;
        daily.clicks++;
      } else if (evt.eventType === 'SOCIAL_CLICK') {
        socialClicks++;
        daily.clicks++;
      }

      dailyMap.set(dateKey, daily);
    });

    const totalOutboundClicks = websiteClicks + applyClicks + pitchDeckClicks + socialClicks;
    const clickThroughRate = totalViews > 0 ? parseFloat(((totalOutboundClicks / totalViews) * 100).toFixed(1)) : 0;

    const dailyTimeSeries = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, counts]) => ({
        date,
        views: counts.views,
        clicks: counts.clicks,
      }));

    const recentClicks = events
      .filter((e: any) => e.eventType !== 'PAGE_VIEW')
      .slice(0, 10)
      .map((e: any) => ({
        eventType: e.eventType,
        targetUrl: e.targetUrl || undefined,
        createdAt: new Date(e.createdAt).toISOString(),
      }));

    return {
      startupId: startup?.id || startupIdOrSlug,
      totalViews,
      websiteClicks,
      applyClicks,
      pitchDeckClicks,
      socialClicks,
      totalOutboundClicks,
      clickThroughRate,
      dailyTimeSeries,
      recentClicks,
    };
  }

  async getEcosystemMetrics(days: number = 30) {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const events = await (prisma as any).analyticsEvent.findMany({
      where: { createdAt: { gte: sinceDate } },
      orderBy: { createdAt: 'desc' },
      take: 2000,
    });

    let totalViews = 0;
    let totalClicks = 0;
    let applyClicks = 0;

    const entityViews = new Map<string, number>();

    events.forEach((e: any) => {
      if (e.eventType === 'PAGE_VIEW') {
        totalViews++;
        entityViews.set(e.entityId, (entityViews.get(e.entityId) || 0) + 1);
      } else {
        totalClicks++;
        if (e.eventType === 'APPLY_CLICK') applyClicks++;
      }
    });

    const topEntities = Array.from(entityViews.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([entityId, count]) => ({ entityId, count }));

    return {
      totalViews,
      totalClicks,
      applyClicks,
      topEntities,
      totalEvents: events.length,
    };
  }
}

export const analyticsRepository = new AnalyticsRepository();
