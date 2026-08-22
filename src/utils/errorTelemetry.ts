// Global Client-Side Error Telemetry

let isInitialized = false;
let lastErrorTimestamp = 0;

export function initErrorTelemetry() {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  // Window unhandled script error
  window.addEventListener('error', (event) => {
    reportClientError({
      message: event.message || 'Uncaught Script Error',
      stackTrace: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`,
      route: window.location.pathname,
      severity: 'ERROR',
    });
  });

  // Window unhandled promise rejection
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = typeof reason === 'string' ? reason : reason?.message || 'Unhandled Promise Rejection';
    const stackTrace = reason?.stack || undefined;

    reportClientError({
      message,
      stackTrace,
      route: window.location.pathname,
      severity: 'WARNING',
    });
  });
}

export async function reportClientError(data: {
  message: string;
  stackTrace?: string;
  route?: string;
  severity?: 'CRITICAL' | 'ERROR' | 'WARNING';
}) {
  const now = Date.now();
  // Throttle reporting to max 1 error per 3 seconds to avoid spamming on recurring render loops
  if (now - lastErrorTimestamp < 3000) return;
  lastErrorTimestamp = now;

  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    await fetch('/api/telemetry/error', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...data,
        route: data.route || window.location.pathname,
      }),
    });
  } catch {
    // Suppress telemetry transmission failures
  }
}
