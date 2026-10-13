// lib/rate-limit.ts
//
// Abuse limits for public entry points. Counters live in the shared database, so a
// limit holds regardless of which instance serves the request; the previous
// in-memory implementation did not survive serverless instances.
import { prisma } from "./prisma";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the current window ends. */
  resetInSeconds: number;
}

/** Public order creation. Documented in README.md ("Order creation limit"). */
export const ORDER_RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };

/** Client identifier used as part of the counter key. */
export function clientIdentifier(forwardedFor: string | null | undefined): string {
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

/**
 * Counts one attempt for `key` and reports whether it is allowed. The increment is
 * a single atomic upsert, so concurrent attempts on the same key cannot lose a
 * count the way a read-then-write would.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const window = `${Math.ceil(windowMs / 1000)} seconds`;

  const rows = await prisma.$queryRaw<
    { count: number; windowStart: Date }[]
  >`
    INSERT INTO "RateLimit" ("key", "windowStart", "count", "updatedAt")
    VALUES (${key}, NOW(), 1, NOW())
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimit"."windowStart" < NOW() - ${window}::interval THEN 1
        ELSE "RateLimit"."count" + 1
      END,
      "windowStart" = CASE
        WHEN "RateLimit"."windowStart" < NOW() - ${window}::interval THEN NOW()
        ELSE "RateLimit"."windowStart"
      END,
      "updatedAt" = NOW()
    RETURNING "count", "windowStart"
  `;

  const { count, windowStart } = rows[0];
  const elapsedMs = Date.now() - new Date(windowStart).getTime();

  return {
    success: count <= limit,
    limit,
    remaining: Math.max(0, limit - count),
    resetInSeconds: Math.max(0, Math.ceil((windowMs - elapsedMs) / 1000)),
  };
}
