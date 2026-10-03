import { NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/auth";
import { getCurrentEventState, isRegistrationAllowed } from "@/src/lib/event-state";
import { enterDrop } from "@/src/lib/drop";
import { createInMemoryRateLimiter } from "@/src/lib/rate-limit";

const dropEntryRateLimiter = createInMemoryRateLimiter("drop-entry", {
  maxRequests: 10,
  windowMs: 60_000,
});

export async function POST(request: Request) {
  try {
    // 1. Authenticate request using the existing auth abstraction
    const { user, errorResponse } = await requireAuth(request);
    if (errorResponse) {
      return errorResponse;
    }

    // 2. Validate request (check content-type and JSON body if provided)
    const contentType = request.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        await request.json();
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: "BAD_REQUEST",
            message: "Malformed JSON in request body",
          },
          { status: 400 }
        );
      }
    }

    // 3. Check event-state abstraction (allow entry only when registration is open)
    const currentState = await getCurrentEventState();
    if (!isRegistrationAllowed(currentState)) {
      return NextResponse.json(
        {
          success: false,
          error: "REGISTRATION_NOT_OPEN",
          message: `Drop registration is not open (current state: ${currentState})`,
          eventState: currentState,
        },
        { status: 403 }
      );
    }

    // 4. Enforce the per-user request limit before processing the entry.
    const rateLimit = dropEntryRateLimiter.check(user.id);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMIT_EXCEEDED",
          message: `Too many drop-entry requests. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
          remainingRequests: rateLimit.remaining,
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    // 5. Call drop-entry service (handles entry creation and duplicate protection)
    const result = await enterDrop(user.id, currentState);

    // 6. Return clear JSON response confirming drop entry
    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        entryId: result.entry.id,
        userId: result.entry.userId,
        isDuplicate: result.isDuplicate,
        alreadyEntered: result.alreadyEntered,
        eventState: result.eventState,
        entry: result.entry,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in /api/drop/enter:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred while processing drop entry",
      },
      { status: 500 }
    );
  }
}
