// Server/edge-side Sentry init (Next.js App Router). No-ops when no DSN is configured.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    return;
  }
  if (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn,
      environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? "local",
      tracesSampleRate: 0,
    });
  }
}

// Captures errors from nested React Server Components.
export const onRequestError = Sentry.captureRequestError;
