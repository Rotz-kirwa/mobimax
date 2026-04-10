import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import './index.css';
import App from './App.jsx';

// Sentry is a no-op when VITE_SENTRY_DSN is not set (dev / CI without the key).
// In production, set VITE_SENTRY_DSN in your Vercel environment variables.
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  environment: import.meta.env.MODE, // 'development' | 'production'
  enabled: Boolean(import.meta.env.VITE_SENTRY_DSN),
  // Capture 10 % of transactions for performance monitoring in production
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 0,
  // Replay 1 % of sessions, 100 % of sessions with errors
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 p-8 text-center">
          <div className="rounded-[28px] bg-white p-12 shadow-xl border border-gray-100 max-w-md w-full">
            <p className="text-2xl font-black uppercase tracking-tighter text-gray-900 mb-3">
              Something went wrong
            </p>
            <p className="text-sm font-medium text-gray-500 mb-8">
              {error?.message || 'An unexpected error occurred. Our team has been notified.'}
            </p>
            <button
              onClick={resetError}
              className="rounded-2xl bg-brand-green px-8 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-opacity-90 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    >
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>
);
