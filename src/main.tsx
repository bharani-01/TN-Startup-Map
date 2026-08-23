import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initErrorTelemetry } from './utils/errorTelemetry';
import { ErrorBoundary } from './components/ErrorBoundary';

// Initialize global crash telemetry
initErrorTelemetry();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
