import { EventState, EventStateType, EventStatusResponse } from "@/src/types/event";
import { EventStateProvider } from "./types";
import { DevStubEventStateProvider } from "./dev-stub";

const defaultStub = new DevStubEventStateProvider();
let activeEventStateProvider: EventStateProvider = defaultStub;

/**
 * Configure or swap the active event state provider.
 * Used when the database layer is integrated by the database teammate.
 */
export function setEventStateProvider(provider: EventStateProvider): void {
  activeEventStateProvider = provider;
}

/**
 * Get the currently active event state provider.
 */
export function getEventStateProvider(): EventStateProvider {
  return activeEventStateProvider;
}

/**
 * Utility to transition or set development event state in memory.
 */
export function setDevEventState(state: EventStateType): void {
  if (activeEventStateProvider instanceof DevStubEventStateProvider) {
    activeEventStateProvider.setState(state);
  }
}

/**
 * Retrieve the current event state.
 */
export async function getCurrentEventState(): Promise<EventStateType> {
  return activeEventStateProvider.getCurrentState();
}

/**
 * Check if registration is permitted in the given state.
 */
export function isRegistrationAllowed(state: EventStateType): boolean {
  return state === EventState.REGISTRATION_OPEN;
}

/**
 * Check if seat booking / selection is permitted in the given state.
 */
export function isBookingAllowed(state: EventStateType): boolean {
  return state === EventState.BOOKING_OPEN;
}

/**
 * Asserts whether an operation permitted in specific states can proceed.
 */
export function isOperationAllowedInStates(
  currentState: EventStateType,
  allowedStates: readonly EventStateType[]
): boolean {
  return allowedStates.includes(currentState);
}

/**
 * Retrieve the full event status with derived allowed operations.
 */
export async function getEventStatus(): Promise<EventStatusResponse> {
  const state = await getCurrentEventState();
  return {
    state,
    allowedOperations: {
      registration: isRegistrationAllowed(state),
      booking: isBookingAllowed(state),
    },
  };
}

export * from "./types";
export * from "./dev-stub";
export * from "@/src/types/event";
