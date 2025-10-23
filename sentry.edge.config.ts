import * as Sentry from "@sentry/nextjs";

const edgeEnabled =
  process.env.SENTRY_ENABLED === "true" && Boolean(process.env.SENTRY_DSN);

if (edgeEnabled) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
  });
}
