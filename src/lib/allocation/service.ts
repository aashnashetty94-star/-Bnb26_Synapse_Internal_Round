import { SupabaseAllocationRpcClient } from "./database-client";
import { AllocateTicketResult, AllocationRpcClient } from "./types";

let activeAllocationRpcClient: AllocationRpcClient =
  new SupabaseAllocationRpcClient();

export function setAllocationRpcClient(client: AllocationRpcClient): void {
  activeAllocationRpcClient = client;
}

/**
 * Request one allocation from the database RPC. The RPC result is the
 * authoritative allocation outcome; this service does not select or lock seats.
 */
export async function allocateTicket(
  userId: string
): Promise<AllocateTicketResult> {
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new TypeError("userId must be a non-empty string");
  }

  return activeAllocationRpcClient.allocateTicket({
    p_user_id: userId.trim(),
  });
}
