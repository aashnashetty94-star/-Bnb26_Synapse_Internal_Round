export interface EligibleUser {
  id: string;
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