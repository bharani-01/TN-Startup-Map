import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../utils/telemetry';

/**
 * Automatically captures route-level page view events for visitor analytics.
 * Debounces rapid transitions and ignores administrative or background routes if needed.
 */
export function usePageTracking(): void {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = location.pathname;

    // Avoid duplicate triggers on same path (e.g., query param only changes or remounts)
    if (lastTrackedPath.current === currentPath) {
      return;
    }
    lastTrackedPath.current = currentPath;

    // Do not track admin back-office internal routes as public visitor metrics
    if (currentPath.startsWith('/admin')) {
      return;
    }

    // Determine entity classification for structured telemetry
    let entityType = 'PAGE';
    let entityId = currentPath;

    if (currentPath === '/') {
      entityType = 'PAGE';
      entityId = 'home';
    } else if (currentPath.startsWith('/startups/') && currentPath !== '/startups') {
      entityType = 'STARTUP';
      entityId = currentPath.replace('/startups/', '');
    } else if (currentPath.startsWith('/districts/') && currentPath !== '/districts') {
      entityType = 'DISTRICT';
      entityId = currentPath.replace('/districts/', '');
    } else if (currentPath.startsWith('/blog/') && currentPath !== '/blog') {
      entityType = 'STORY';
      entityId = currentPath.replace('/blog/', '');
    } else if (currentPath.startsWith('/jobs')) {
      entityType = 'PAGE';
      entityId = 'jobs';
    } else if (currentPath.startsWith('/map')) {
      entityType = 'PAGE';
      entityId = 'map';
    }

    // Dispatch non-blocking telemetry event
    trackEvent({
      entityType,
      entityId,
      eventType: 'PAGE_VIEW',
      metadata: {
        title: typeof document !== 'undefined' ? document.title : '',
        search: location.search,
        hash: location.hash,
      },
    });
  }, [location.pathname, location.search, location.hash]);
}
