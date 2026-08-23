import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f7',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#1d1d1f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              fontSize: 28,
            }}
          >
            ⚡
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#1d1d1f',
              margin: '0 0 8px',
              letterSpacing: '-0.03em',
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: 14,
              color: '#86868b',
              margin: '0 0 32px',
              maxWidth: 360,
              lineHeight: 1.6,
            }}
          >
            An unexpected error occurred. Refreshing the page usually fixes this.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px',
              borderRadius: 980,
              backgroundColor: '#1d1d1f',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            Reload Page
          </button>
          {(typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') && this.state.error && (
            <details
              style={{
                marginTop: 32,
                textAlign: 'left',
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 12,
                padding: '12px 16px',
                maxWidth: 600,
                width: '100%',
                fontSize: 12,
                color: '#86868b',
                whiteSpace: 'pre-wrap',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#1d1d1f', marginBottom: 8 }}>
                Error details (dev only)
              </summary>
              {this.state.error.stack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
