import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
};

const sentryWebpackPluginOptions = {
  silent: true,
  dryRun: !process.env.SENTRY_DSN,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
