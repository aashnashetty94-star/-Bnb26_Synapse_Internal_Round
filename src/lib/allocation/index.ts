export { selectRandomEligibleUsers } from "./random-selector";
export { allocateTicket, setAllocationRpcClient } from "./service";
export { SupabaseAllocationRpcClient } from "./database-client";
export { SupabaseEligibleUserProvider } from "./eligibility-provider";
export { SupabaseActiveEventProvider } from "./active-event-provider";
export type {
  ActiveEvent,
  ActiveEventProvider,
  DatabaseEventStatus,
} from "./active-event-provider";
export { runAllocation } from "./orchestration";
export type {
  AllocateTicketRequest,
  AllocateTicketResult,
  AllocationRpcClient,
  AllocationRunDependencies,
  AllocationRunResult,
  EligibleUser,
  EligibleUserProvider,
  FailedAllocation,
  SuccessfulAllocation,
} from "./types";