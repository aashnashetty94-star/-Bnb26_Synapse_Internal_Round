export { selectRandomEligibleUsers } from "./random-selector";
export { allocateTicket, setAllocationRpcClient } from "./service";
export { SupabaseAllocationRpcClient } from "./database-client";
export type {
  AllocateTicketRequest,
  AllocateTicketResult,
  AllocationRpcClient,
  EligibleUser,
} from "./types";