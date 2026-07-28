import * as Sentry from "@sentry/node";
import { scrubEvent } from "./sentry-scrub";

// Server-side (Nitro/Vercel) Sentry. No-op unless the DSN is set. VITE_SITE
// vars are readable via process.env on the server, so we reuse VITE_SENTRY_DSN
// (falling back to a plain SENTRY_DSN if someone sets that instead).

let initialized = false;

function dsn(): string | undefined {
  return process.env.VITE_SENTRY_DSN || process.env.SENTRY_DSN || undefined;
}

export function initSentryServer(): void {
  if (initialized || !dsn()) return;
  initialized = true;
  Sentry.init({
    dsn: dsn(),
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0,
    sendDefaultPii: false,
    beforeSend: scrubEvent,
  });
}

/** Capture a server-side error. No-op if unconfigured. Never throws. */
export function captureServerError(error: unknown): void {
  if (!dsn()) return;
  try {
    initSentryServer();
    Sentry.captureException(error);
  } catch {
    // Sentry must never break the request path.
  }
}
