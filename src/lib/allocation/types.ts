export interface EligibleUser {
  id: string;
}

export interface EligibleUserProvider {
  getEligibleUsers(eventId: string): Promise<EligibleUser[]>;
}

export interface AllocateTicketRequest {
  p_user_id: string;
}

export type AllocateTicketResult =
  | {
      success: true;
      allocation_id: string;
      seat_id: string;
    }
  | {
      success: false;
      error: string;
    };

export interface AllocationRpcClient {
  allocateTicket(
    request: AllocateTicketRequest
  ): Promise<AllocateTicketResult>;
}

export interface SuccessfulAllocation {
  user: EligibleUser;
  allocation_id: string;
  seat_id: string;
}

export interface FailedAllocation {
  user: EligibleUser;
  error: string;
}

export interface AllocationRunResult {
  selectedUsers: EligibleUser[];
  successfulAllocations: SuccessfulAllocation[];
  failedAllocations: FailedAllocation[];
  requestedCapacity: number;
  selectedCount: number;
  successfulCount: number;
  failedCount: number;
}

export interface AllocationRunDependencies {
  selectUsers(
    eligibleUsers: readonly EligibleUser[],
    capacity: number
  ): EligibleUser[];
  allocateUser(userId: string): Promise<AllocateTicketResult>;
}