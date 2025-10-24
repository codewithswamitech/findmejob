import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

interface RateLimitConfig {
  windowSec?: number;
  maxRequests?: number;
}

export async function checkRateLimit(
  identifier: string,
  context: string,
  config?: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const windowSec =
    config?.windowSec ?? parseInt(process.env.RATE_LIMIT_WINDOW_SEC ?? "60");
  const maxRequests =
    config?.maxRequests ??
    parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? "10");

  const now = new Date();
  const windowStart = new Date(
    Math.floor(now.getTime() / (windowSec * 1000)) * (windowSec * 1000)
  );
  const windowEnd = new Date(windowStart.getTime() + windowSec * 1000);
  const previousWindowStart = new Date(
    windowStart.getTime() - windowSec * 1000
  );

  // Clean up old entries (older than 2 windows)
  const oldWindowStart = new Date(windowStart.getTime() - 2 * windowSec * 1000);
  await prisma.rateLimitCounter.deleteMany({
    where: {
      windowStart: {
        lt: oldWindowStart,
      },
    },
  });

  // Get or create counter for current window
  const counter = await prisma.rateLimitCounter.upsert({
    where: {
      identifier_context_windowStart: {
        identifier,
        context,
        windowStart,
      },
    },
    update: {
      hits: {
        increment: 1,
      },
    },
    create: {
      identifier,
      context,
      windowStart,
      hits: 1,
    },
  });

  const previousCounter = await prisma.rateLimitCounter.findUnique({
    where: {
      identifier_context_windowStart: {
        identifier,
        context,
        windowStart: previousWindowStart,
      },
    },
  });

  const elapsedInWindow = now.getTime() - windowStart.getTime();
  const windowMs = windowSec * 1000;
  const weight = 1 - elapsedInWindow / windowMs;
  const slidingHits =
    counter.hits + Math.max(0, weight) * (previousCounter?.hits ?? 0);

  const allowed = slidingHits <= maxRequests;
  const remaining = Math.max(0, Math.floor(maxRequests - slidingHits));

  return {
    allowed,
    remaining,
    resetAt: windowEnd,
  };
}

export async function getClientIdentifier(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export async function rateLimitMiddleware(
  identifier: string,
  context: string = "api",
  config?: RateLimitConfig
): Promise<Response | null> {
  const result = await checkRateLimit(identifier, context, config);

  if (!result.allowed) {
    return Response.json(
      {
        error: "Too many requests",
        resetAt: result.resetAt.toISOString(),
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(
            (result.resetAt.getTime() - Date.now()) / 1000
          ).toString(),
        },
      }
    );
  }

  return null;
}
