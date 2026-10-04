import { clearDevDropEntries } from "@/src/lib/drop";
import { clearRateLimitState } from "@/src/lib/rate-limit";
import { clearActivityState } from "@/src/lib/risk";
import { SupabaseResetDatabaseProvider } from "./supabase-reset-provider";
import { ResetDatabaseProvider } from "./types";

const defaultResetDatabaseProvider = new SupabaseResetDatabaseProvider();

export async function resetSystem(
  resetDatabaseProvider: ResetDatabaseProvider = defaultResetDatabaseProvider
): Promise<void> {
  await resetDatabaseProvider.resetDatabase();
  await clearDevDropEntries();
  clearActivityState();
  clearRateLimitState();
}
