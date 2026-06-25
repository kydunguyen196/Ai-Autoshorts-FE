// Client-side Sentry init (Next.js App Router). No-ops when NEXT_PUBLIC_SENTRY_DSN is unset.
import * as Sentry from "@sentry/nextjs";

import { env } from "@/lib/env";

if (env.sentryDsn) {
  Sentry.init({
    dsn: env.sentryDsn,
    environment: env.sentryEnvironment,
    tracesSampleRate: 0,
  });
  // Expose to the lightweight reporter used by error boundaries (see lib/report-error.ts).
  (globalThis as typeof globalThis & { Sentry?: typeof Sentry }).Sentry = Sentry;
}

// Required by @sentry/nextjs to instrument client-side navigations.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
