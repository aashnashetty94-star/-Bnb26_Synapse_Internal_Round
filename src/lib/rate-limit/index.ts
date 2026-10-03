export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface InMemoryRateLimiterOptions {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitWindow {
  count: number;
  startedAt: number;
}

declare global {
  var __fairdrop_rate_limit_stores__:
    | Map<string, Map<string, RateLimitWindow>>
    | undefined;
}

/**
 * Create a process-local fixed-window rate limiter with an independent bucket
 * for each key.
 */
export function createInMemoryRateLimiter(
  name: string,
  { maxRequests, windowMs }: InMemoryRateLimiterOptions
): { check(key: string): RateLimitResult } {
  if (!name.trim()) {
    throw new Error("Rate limiter name must not be empty");
  }
  if (!Number.isSafeInteger(maxRequests) || maxRequests < 1) {
    throw new RangeError("maxRequests must be a positive integer");
  }
  if (!Number.isSafeInteger(windowMs) || windowMs < 1) {
    throw new RangeError("windowMs must be a positive integer");
  }

  const stores =
    (globalThis.__fairdrop_rate_limit_stores__ ??=
      new Map<string, Map<string, RateLimitWindow>>());
  let windows = stores.get(name);
  if (!windows) {
    windows = new Map<string, RateLimitWindow>();
    stores.set(name, windows);
  }

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();

      for (const [windowKey, window] of windows) {
        if (window.startedAt + windowMs <= now) {
          windows.delete(windowKey);
        }
      }

      let currentWindow = windows.get(key);
      if (!currentWindow) {
        currentWindow = { count: 0, startedAt: now };
        windows.set(key, currentWindow);
      }

      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((currentWindow.startedAt + windowMs - now) / 1000)
      );

      if (currentWindow.count >= maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds,
        };
      }

      currentWindow.count += 1;
      return {
        allowed: true,
        remaining: maxRequests - currentWindow.count,
        retryAfterSeconds: 0,
      };
    },
  };
}
