import { EventState, EventStateType } from "@/src/types/event";
import { EventStateProvider } from "./types";

/**
 * ============================================================================
 * TEMPORARY DEVELOPMENT EVENT-STATE STUB
 * ============================================================================
 *
 * CAUTION: This stub is strictly for local development and testing purposes.
 * It provides a configurable in-memory / environment-driven event state.
 *
 * It will be replaced once the database teammate creates the real event table
 * and exposes real event state queries.
 *
 * Behavior:
 * - Defaults to `UPCOMING` (or environment variable `FAIRDROP_EVENT_STATE`).
 * - Provides `setState()` to test state transitions in memory.
 */
export class DevStubEventStateProvider implements EventStateProvider {
  readonly name = "dev-stub";
  private static currentState: EventStateType =
    (process.env.FAIRDROP_EVENT_STATE as EventStateType) || EventState.UPCOMING;

  constructor(initialState?: EventStateType) {
    if (initialState) {
      DevStubEventStateProvider.currentState = initialState;
    }
  }

  async getCurrentState(): Promise<EventStateType> {
    return DevStubEventStateProvider.currentState;
  }

  setState(newState: EventStateType): void {
    DevStubEventStateProvider.currentState = newState;
  }
}
