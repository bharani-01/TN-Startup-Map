export type TelemetryEventType =
  | 'PAGE_VIEW'
  | 'WEBSITE_CLICK'
  | 'APPLY_CLICK'
  | 'PITCH_DECK_CLICK'
  | 'SOCIAL_CLICK';

export interface TrackClickOptions {
  entityType: 'STARTUP' | 'JOB' | 'STORY';
  entityId: string;
  eventType: TelemetryEventType;
  targetUrl?: string;
  metadata?: Record<string, any>;
}

/**
 * Non-blocking client-side telemetry event dispatcher
 */
export function trackEvent(options: TrackClickOptions): void {
  try {
    const payload = {
      eventType: options.eventType,
      entityType: options.entityType,
      entityId: options.entityId,
      targetUrl: options.targetUrl,
      referrer: document.referrer || undefined,
      metadata: {
        ...options.metadata,
        path: window.location.pathname,
        timestamp: new Date().toISOString(),
      },
    };

    // Use sendBeacon if available for reliable background delivery on navigation
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
    } else {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    // Non-blocking, fails silently
  }
}
