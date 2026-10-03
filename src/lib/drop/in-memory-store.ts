import { DropEntry } from "@/src/types/drop";
import { DropStore } from "./types";

declare global {
  // Preserve in-memory storage across module re-evaluations during development
  var __fairdrop_in_memory_drop_store__: Map<string, DropEntry> | undefined;
}

/**
 * ============================================================================
 * TEMPORARY IN-MEMORY DROP STORE
 * ============================================================================
 *
 * CAUTION: This is an isolated development abstraction for local testing and
 * simulator execution. It is NOT production-ready persistence.
 *
 * It will be replaced once the database teammate connects the real
 * PostgreSQL/Supabase database tables.
 *
 * Characteristics:
 * - Keyed by userId to enforce singular registration per user.
 * - Thread-safe within a Node.js process runtime.
 * - Completely avoids inventing database tables, SQL, or schema.
 */
export class InMemoryDropStore implements DropStore {
  readonly name = "in-memory-dev-stub";

  private get store(): Map<string, DropEntry> {
    if (!globalThis.__fairdrop_in_memory_drop_store__) {
      globalThis.__fairdrop_in_memory_drop_store__ = new Map<string, DropEntry>();
    }
    return globalThis.__fairdrop_in_memory_drop_store__;
  }

  async findByUserId(userId: string): Promise<DropEntry | null> {
    return this.store.get(userId) || null;
  }

  async createEntry(userId: string): Promise<DropEntry> {
    // Defensive check: if entry already exists, return existing to avoid duplicate creation
    const existing = this.store.get(userId);
    if (existing) {
      return existing;
    }

    const entry: DropEntry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      userId,
      enteredAt: new Date().toISOString(),
      status: "REGISTERED",
    };

    this.store.set(userId, entry);
    return entry;
  }

  async getAllEntries(): Promise<DropEntry[]> {
    return Array.from(this.store.values());
  }

  async count(): Promise<number> {
    return this.store.size;
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}
