import { DropEntry } from "@/src/types/drop";

/**
 * Persistence contract for drop entries.
 * Decouples business logic and duplicate protection from the underlying storage mechanism.
 * The database teammate will implement this contract using PostgreSQL/Supabase later.
 */
export interface DropStore {
  readonly name: string;
  findByUserId(userId: string): Promise<DropEntry | null>;
  createEntry(userId: string): Promise<DropEntry>;
  getAllEntries(): Promise<DropEntry[]>;
  count(): Promise<number>;
  clear(): Promise<void>;
}
