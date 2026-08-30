import { db, prisma } from '../database/connection.js';
import { TrackEventDTO, StartupAnalyticsMetrics, AnalyticsEvent } from '../models/Analytics.js';

export interface EcosystemTrafficMetrics {
  totalVisits: number;
  allTimeVisits: number;
  todayVisits: number;
  yesterdayVisits: number;
  uniqueVisitors: number;
  totalOutboundClicks: number;
  clickThroughRate: number;
  dailyTimeSeries: { date: string; views: number; clicks: number }[];
  topStartups: { id: string; name: string; slug: string; views: number; district?: string }[];
  topPages: { path: string; views: number; percentage: number }[];
  topOutbound: { eventType: string; targetUrl?: string; count: number }[];
  recentEvents: { id: string; eventType: string; entityType: string; entityId: string; targetUrl?: string; createdAt: string }[];
}

export class AnalyticsRepository {
  private memoryEvents: AnalyticsEvent[] = [];
  private readonly MAX_MEMORY_EVENTS = 500;
  private writeQueue: any[] = [];
  private isFlushing = false;

  constructor() {
    // Periodic background flush to PostgreSQL every 3 seconds
    setInterval(() => this.flushWriteQueue(), 3000);
  }

  private async flushWriteQueue() {
    if (this.isFlushing || this.writeQueue.length === 0) return;
    this.isFlushing = true;
    const batch = this.writeQueue.splice(0, 50);

    try {
      if ((prisma as any).analyticsEvent?.createMany) {
        await (prisma as any).analyticsEvent.createMany({
          data: batch,
          skipDuplicates: true,
        });
      } else {
        for (const item of batch) {
          await (prisma as any).analyticsEvent.create({ data: item });
        }
      }
    } catch (err: any) {
      // Non-fatal, suppress connection pool errors from breaking the app
      console.warn('[Analytics] Buffered write flush warning:', err.message);
    } finally {
      this.isFlushing = false;
    }
  }

  async recordEvent(
    data: TrackEventDTO,
    actorId?: string,
    actorEmail?: string,
    ipAddress?: string
  ): Promise<AnalyticsEvent> {
    const id = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const createdAt = new Date().toISOString();

    const event: AnalyticsEvent = {
      id,
      eventType: data.eventType,
      entityType: data.entityType,
      entityId: data.entityId,
      targetUrl: data.targetUrl || undefined,
      actorId: actorId || undefined,
      actorEmail: actorEmail || undefined,
      ipAddress: ipAddress || undefined,
      referrer: data.referrer || undefined,
      metadata: data.metadata || undefined,
      createdAt,
    };

    // 1. Keep in fast memory ring buffer for instant retrieval
    this.memoryEvents.unshift(event);
    if (this.memoryEvents.length > this.MAX_MEMORY_EVENTS) {
      this.memoryEvents.pop();
    }

    // 2. Queue for batched persistence without blocking HTTP connections
    this.writeQueue.push({
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
      createdAt: new Date(createdAt),
    });

    return event;
  }

  async getStartupMetrics(startupIdOrSlug: string, days: number = 30): Promise<StartupAnalyticsMetrics> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    // 1. Resolve startup from memory repository
    const allStartups = Array.from(db.startups.values());
    const startup = db.startups.get(startupIdOrSlug) ||
      allStartups.find(
        (s) =>
          s.slug === startupIdOrSlug ||
          s.id === startupIdOrSlug ||
          s.publicId === startupIdOrSlug ||
          s.name.toLowerCase() === startupIdOrSlug.toLowerCase()
      );

    const targetIds = startup
      ? Array.from(new Set([startup.id, startup.slug, startup.publicId].filter(Boolean)))
      : [startupIdOrSlug];

    // 2. Fetch events matching startup ID or slug
    let dbEvents: any[] = [];
    try {
      dbEvents = await (prisma as any).analyticsEvent.findMany({
        where: {
          entityId: { in: targetIds },
          createdAt: { gte: sinceDate },
        },
        orderBy: { createdAt: 'desc' },
        take: 2000,
      });
    } catch {
      // Fallback to in-memory events if DB connection pool is under load
      dbEvents = this.memoryEvents.filter((e) => targetIds.includes(e.entityId) && new Date(e.createdAt) >= sinceDate);
    }

    // Combine with unpersisted writeQueue events
    const queuedEvents = this.writeQueue
      .filter((e) => targetIds.includes(e.entityId) && new Date(e.createdAt) >= sinceDate)
      .map((e) => ({ ...e, createdAt: new Date(e.createdAt).toISOString() }));

    const allMatchedEvents = [...queuedEvents, ...dbEvents];
    const seenEventIds = new Set<string>();
    const events = allMatchedEvents.filter((e) => {
      if (seenEventIds.has(e.id)) return false;
      seenEventIds.add(e.id);
      return true;
    });

    // 3. Aggregate counts
    let totalViews = 0;
    let websiteClicks = 0;
    let applyClicks = 0;
    let pitchDeckClicks = 0;
    let socialClicks = 0;

    const dailyMap = new Map<string, { views: number; clicks: number }>();

    // Pre-populate days
    for (let i = days - 1; i >= 0; i--) {
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

  async getEcosystemMetrics(days: number = 30): Promise<EcosystemTrafficMetrics> {
    const now = new Date();
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    // 1. Build startup map from in-memory database
    const startupMap = new Map<string, { id: string; name: string; slug: string; district?: string }>();
    db.startups.forEach((s) => {
      const data = { id: s.id, name: s.name, slug: s.slug, district: s.city || s.district || 'Tamil Nadu' };
      startupMap.set(s.id, data);
      startupMap.set(s.slug, data);
      if (s.publicId) startupMap.set(s.publicId, data);
    });

    // 2. Fetch analytics events safely
    let events: any[] = [];
    let allTimeViewsCount = 0;

    try {
      const [dbEvents, dbCount] = await Promise.all([
        (prisma as any).analyticsEvent.findMany({
          where: { createdAt: { gte: sinceDate } },
          orderBy: { createdAt: 'desc' },
          take: 10000,
        }),
        (prisma as any).analyticsEvent.count({
          where: { eventType: 'PAGE_VIEW' },
        }),
      ]);
      events = dbEvents;
      allTimeViewsCount = dbCount;
    } catch {
      events = this.memoryEvents.filter((e) => new Date(e.createdAt) >= sinceDate);
      allTimeViewsCount = this.memoryEvents.filter((e) => e.eventType === 'PAGE_VIEW').length;
    }

    // Include pending queued writes
    const queuedEvents = this.writeQueue
      .filter((e) => new Date(e.createdAt) >= sinceDate)
      .map((e) => ({ ...e, createdAt: new Date(e.createdAt).toISOString() }));

    const mergedEvents = [...queuedEvents, ...events];
    const seenEventIds = new Set<string>();
    const finalEvents = mergedEvents.filter((e) => {
      if (seenEventIds.has(e.id)) return false;
      seenEventIds.add(e.id);
      return true;
    });

    let totalVisits = 0;
    let todayVisits = 0;
    let yesterdayVisits = 0;
    let totalOutboundClicks = 0;
    const uniqueIps = new Set<string>();

    const dailyMap = new Map<string, { views: number; clicks: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap.set(key, { views: 0, clicks: 0 });
    }

    const startupViewsCount = new Map<string, number>();
    const pageViewsCount = new Map<string, number>();
    const outboundClicksCount = new Map<string, { eventType: string; targetUrl?: string; count: number }>();

    finalEvents.forEach((e: any) => {
      const eventTime = new Date(e.createdAt);
      const dateKey = eventTime.toISOString().split('T')[0];
      const daily = dailyMap.get(dateKey) || { views: 0, clicks: 0 };

      if (e.ipAddress) {
        uniqueIps.add(e.ipAddress);
      } else if (e.actorId) {
        uniqueIps.add(e.actorId);
      }

      if (e.eventType === 'PAGE_VIEW') {
        totalVisits++;
        daily.views++;

        if (eventTime >= todayStart) {
          todayVisits++;
        } else if (eventTime >= yesterdayStart && eventTime < todayStart) {
          yesterdayVisits++;
        }

        // Entity breakdown
        const matchedStartup = startupMap.get(e.entityId) ||
          Array.from(db.startups.values()).find((s) => s.id === e.entityId || s.slug === e.entityId || s.publicId === e.entityId);

        if (matchedStartup) {
          const key = matchedStartup.id;
          startupViewsCount.set(key, (startupViewsCount.get(key) || 0) + 1);
        }

        // Page breakdown
        const pagePath = e.metadata?.path || (e.entityType === 'PAGE' ? `/${e.entityId}` : `/${e.entityType.toLowerCase()}/${e.entityId}`);
        pageViewsCount.set(pagePath, (pageViewsCount.get(pagePath) || 0) + 1);

      } else {
        totalOutboundClicks++;
        daily.clicks++;

        const outKey = `${e.eventType}_${e.targetUrl || ''}`;
        const existing = outboundClicksCount.get(outKey) || { eventType: e.eventType, targetUrl: e.targetUrl, count: 0 };
        existing.count++;
        outboundClicksCount.set(outKey, existing);
      }

      dailyMap.set(dateKey, daily);
    });

    const clickThroughRate = totalVisits > 0 ? parseFloat(((totalOutboundClicks / totalVisits) * 100).toFixed(1)) : 0;

    const dailyTimeSeries = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, counts]) => ({
        date,
        views: counts.views,
        clicks: counts.clicks,
      }));

    // Top Startups Leaderboard (Resolving from db.startups)
    const topStartups = Array.from(startupViewsCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([idOrSlug, views]) => {
        const info = startupMap.get(idOrSlug) || db.startups.get(idOrSlug);
        return {
          id: info?.id || idOrSlug,
          name: info?.name || idOrSlug,
          slug: info?.slug || idOrSlug,
          views,
          district: info?.district || (info as any)?.city || 'Tamil Nadu',
        };
      });

    // Top Pages
    const topPages = Array.from(pageViewsCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({
        path,
        views,
        percentage: totalVisits > 0 ? parseFloat(((views / totalVisits) * 100).toFixed(1)) : 0,
      }));

    // Top Outbound
    const topOutbound = Array.from(outboundClicksCount.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const recentEvents = finalEvents.slice(0, 15).map((e: any) => ({
      id: e.id,
      eventType: e.eventType,
      entityType: e.entityType,
      entityId: e.entityId,
      targetUrl: e.targetUrl || undefined,
      createdAt: new Date(e.createdAt).toISOString(),
    }));

    return {
      totalVisits,
      allTimeVisits: Math.max(allTimeViewsCount, totalVisits),
      todayVisits,
      yesterdayVisits,
      uniqueVisitors: Math.max(uniqueIps.size, 1),
      totalOutboundClicks,
      clickThroughRate,
      dailyTimeSeries,
      topStartups,
      topPages,
      topOutbound,
      recentEvents,
    };
  }

  async getAllStartupsViewCounts(): Promise<Record<string, number>> {
    let events: any[] = [];
    try {
      events = await (prisma as any).analyticsEvent.findMany({
        where: { eventType: 'PAGE_VIEW' },
        select: { entityId: true },
      });
    } catch {
      events = this.memoryEvents.filter((e) => e.eventType === 'PAGE_VIEW');
    }

    const map: Record<string, number> = {};
    events.forEach((e: any) => {
      if (e.entityId) {
        map[e.entityId] = (map[e.entityId] || 0) + 1;
        // Also map to slug and ID if matched in db.startups
        const st = db.startups.get(e.entityId) ||
          Array.from(db.startups.values()).find((s) => s.slug === e.entityId || s.id === e.entityId || s.publicId === e.entityId);
        if (st) {
          map[st.id] = (map[st.id] || 0) + 1;
          map[st.slug] = (map[st.slug] || 0) + 1;
        }
      }
    });

    return map;
  }
}

export const analyticsRepository = new AnalyticsRepository();
