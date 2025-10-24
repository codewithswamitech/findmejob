import * as Sentry from "@sentry/nextjs";

const clientEnabled =
  process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true" &&
  Boolean(process.env.SENTRY_DSN);

if (clientEnabled) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.1,
  });
}
