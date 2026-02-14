// lib/rate-limit.ts
import { NextRequest } from "next/server";

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory store (untuk produksi pakai Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(
  request: NextRequest,
  limit: number = 100, // 100 requests
  window: number = 15 * 60 * 1000, // 15 minutes
): Promise<RateLimitResult> {
  const identifier = getIdentifier(request);
  const now = Date.now();

  // Get or create rate limit entry
  let entry = rateLimitStore.get(identifier);

  // Reset if window expired
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + window,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(identifier, entry);

  // Cleanup old entries (simple garbage collection)
  if (Math.random() < 0.01) {
    // 1% chance
    cleanupOldEntries(now);
  }

  const remaining = Math.max(0, limit - entry.count);
  const success = entry.count <= limit;

  return {
    success,
    limit,
    remaining,
    reset: Math.ceil((entry.resetTime - now) / 1000), // seconds
  };
}

function getIdentifier(request: NextRequest): string {
  // Try to get IP address
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";

  // Combine IP with path for more granular rate limiting
  const path = request.nextUrl.pathname;
  return `${ip}:${path}`;
}

function cleanupOldEntries(now: number) {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// API-specific rate limits
export const API_RATE_LIMITS = {
  "/api/auth": { limit: 10, window: 15 * 60 * 1000 }, // 10 per 15 min
  "/api/orders": { limit: 50, window: 15 * 60 * 1000 }, // 50 per 15 min
  "/api/products": { limit: 100, window: 15 * 60 * 1000 }, // 100 per 15 min
  "/api/admin": { limit: 200, window: 15 * 60 * 1000 }, // 200 per 15 min
};
