// Central client-side error reporter. Logs to the console and forwards to Sentry when configured.
// Kept dependency-light so error boundaries can call it without importing Sentry directly.
export function reportError(error: unknown, context?: Record<string, unknown>) {
  console.error("[reportError]", error, context ?? {});

  // Forward to Sentry if the SDK has been initialized (see instrumentation-client.ts).
  const sentry = (globalThis as { Sentry?: { captureException?: (e: unknown, c?: unknown) => void } }).Sentry;
  if (sentry?.captureException) {
    sentry.captureException(error, context ? { extra: context } : undefined);
  }
}
