export type AnalyticsEventType = 
  | 'PAGE_VIEW' 
  | 'WEBSITE_CLICK' 
  | 'APPLY_CLICK' 
  | 'PITCH_DECK_CLICK' 
  | 'SOCIAL_CLICK';

export interface AnalyticsEvent {
  id: string;
  eventType: AnalyticsEventType;
  entityType: string;
  entityId: string;
  targetUrl?: string;
  actorId?: string;
  actorEmail?: string;
  ipAddress?: string;
  referrer?: string;
  metadata?: any;
  createdAt: string;
}

export interface TrackEventDTO {
  eventType: AnalyticsEventType;
  entityType: 'STARTUP' | 'JOB' | 'STORY';
  entityId: string;
  targetUrl?: string;
  referrer?: string;
  metadata?: any;
}

export interface StartupAnalyticsMetrics {
  startupId: string;
  totalViews: number;
  websiteClicks: number;
  applyClicks: number;
  pitchDeckClicks: number;
  socialClicks: number;
  totalOutboundClicks: number;
  clickThroughRate: number; // percentage
  dailyTimeSeries: {
    date: string;
    views: number;
    clicks: number;
  }[];
  recentClicks: {
    eventType: AnalyticsEventType;
    targetUrl?: string;
    createdAt: string;
  }[];
}

export interface ApiAccessLog {
  id: string;
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  method: string;
  route: string;
  statusCode: number;
  durationMs: number;
  ipAddress?: string;
  userAgent?: string;
  queryParams?: any;
  createdAt: string;
}

export interface AuditLogFilters {
  search?: string;
  method?: string;
  role?: string;
  statusCode?: number;
  actorEmail?: string;
  limit?: number;
  offset?: number;
}
