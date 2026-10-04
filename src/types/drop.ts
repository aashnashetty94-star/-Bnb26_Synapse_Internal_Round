import { EventStateType } from "./event";

/**
 * Status of a user's entry in the drop.
 */
export type DropEntryStatus = "REGISTERED" | "CANCELLED";

/**
 * Clean business-level representation of an authenticated user's drop entry.
 * Provider/database agnostic; strictly avoids inventing database columns or schema.
 */
export interface DropEntry {
  id: string;
  userId: string;
  enteredAt: string;
  status: DropEntryStatus;
}

/**
 * Service-level outcome of a drop registration attempt.
 */
export interface DropEntryResult {
  success: boolean;
  message: string;
  isDuplicate: boolean;
  alreadyEntered: boolean;
  entry: DropEntry;
  eventState: EventStateType;
}

/**
 * Standard API response structure for POST /api/drop/enter.
 */
export interface DropEnterResponse {
  success: boolean;
  message: string;
  entryId?: string;
  userId?: string;
  isDuplicate?: boolean;
  alreadyEntered?: boolean;
  eventState?: EventStateType;
  entry?: DropEntry;
  error?: string;
}
