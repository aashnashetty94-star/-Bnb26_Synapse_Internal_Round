import { EventStateType } from "@/src/types/event";
import { DropEntryResult } from "@/src/types/drop";
import { DropStore } from "./types";
import { InMemoryDropStore } from "./in-memory-store";

let activeDropStore: DropStore = new InMemoryDropStore();

/**
 * Configure or swap the active drop persistence store.
 * Allows seamless integration when the database teammate's schema is ready.
 */
export function setDropStore(store: DropStore): void {
  activeDropStore = store;
}

/**
 * Retrieve the active drop persistence store.
 */
export function getDropStore(): DropStore {
  return activeDropStore;
}

/**
 * Core business logic for entering the drop with duplicate protection.
 *
 * Requirements:
 * - A user must not receive multiple independent drop entries.
 * - Repeated requests from the same authenticated user must be treated as the same entry
 *   rather than creating another registration.
 */
export async function enterDrop(
  userId: string,
  eventState: EventStateType
): Promise<DropEntryResult> {
  const existingEntry = await activeDropStore.findByUserId(userId);

  if (existingEntry) {
    return {
      success: true,
      message: "User has already entered this drop",
      isDuplicate: true,
      alreadyEntered: true,
      entry: existingEntry,
      eventState,
    };
  }

  const newEntry = await activeDropStore.createEntry(userId);

  return {
    success: true,
    message: "Drop entry successful",
    isDuplicate: false,
    alreadyEntered: false,
    entry: newEntry,
    eventState,
  };
}

/**
 * Reset development entries (useful in automated tests and simulator runs).
 */
export async function clearDevDropEntries(): Promise<void> {
  await activeDropStore.clear();
}
