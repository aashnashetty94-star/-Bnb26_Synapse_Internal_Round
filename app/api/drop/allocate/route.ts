import { requireAuth } from "@/src/lib/auth";
import { getCurrentEventState, isBookingAllowed } from "@/src/lib/event-state";
import {
  runAllocation,
  SupabaseActiveEventProvider,
  SupabaseEligibleUserProvider,
} from "@/src/lib/allocation";
import { EventState } from "@/src/types/event";
import { NextResponse } from "next/server";

const activeEventProvider = new SupabaseActiveEventProvider();
const eligibleUserProvider = new SupabaseEligibleUserProvider();
const ALLOCATION_CAPACITY = 500;

function getEventStateFromDatabaseStatus(
  status: "registration" | "allocation" | "closed"
) {
  switch (status) {
    case "registration":
      return EventState.REGISTRATION_OPEN;
    case "allocation":
      return EventState.BOOKING_OPEN;
    case "closed":
      return EventState.COMPLETED;
  }
}

export async function POST(request: Request) {
  try {
    const { errorResponse } = await requireAuth(request);
    if (errorResponse) {
      return errorResponse;
    }

    const backendEventState = await getCurrentEventState();
    if (!isBookingAllowed(backendEventState)) {
      return NextResponse.json(
        {
          success: false,
          error: "ALLOCATION_NOT_OPEN",
          message: `Allocation is not open (current state: ${backendEventState})`,
        },
        { status: 403 }
      );
    }

    const activeEvent = await activeEventProvider.getActiveEvent();
    if (!activeEvent) {
      return NextResponse.json(
        {
          success: false,
          error: "NO_ACTIVE_EVENT",
          message: "No active event is available for allocation",
        },
        { status: 404 }
      );
    }

    const databaseEventState = getEventStateFromDatabaseStatus(
      activeEvent.status
    );
    if (
      !isBookingAllowed(databaseEventState) ||
      backendEventState !== EventState.BOOKING_OPEN
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "ALLOCATION_NOT_OPEN",
          message: "The active event is not open for allocation",
        },
        { status: 403 }
      );
    }

    const eligibleUsers = await eligibleUserProvider.getEligibleUsers(
      activeEvent.eventId
    );
    const result = await runAllocation(eligibleUsers, ALLOCATION_CAPACITY);

    return NextResponse.json(
      {
        success: result.failedCount === 0,
        selectedCount: result.selectedCount,
        successfulCount: result.successfulCount,
        failedCount: result.failedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in /api/drop/allocate:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred while processing allocation",
      },
      { status: 500 }
    );
  }
}
