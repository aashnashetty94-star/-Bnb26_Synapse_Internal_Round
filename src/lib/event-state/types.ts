import { EventStateType } from "@/src/types/event";

/**
 * Provider-agnostic contract for fetching the current FairDrop event state.
 * Allows decoupling business logic from the eventual database implementation.
 */
export interface EventStateProvider {
  readonly name: string;
  getCurrentState(): Promise<EventStateType>;
}
