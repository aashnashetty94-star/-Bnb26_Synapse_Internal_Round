export type UserType = "human" | "impatient" | "bot";

export interface SimulatedUser {
  id: string;
  type: UserType;
}

export interface SimulationResult {
  userId: string;
  type: UserType;
  requests: number;
  enteredQueue: boolean;
  allocated: boolean;
  blocked: boolean;
  throttled: boolean;
  duplicateAllocation: boolean;
}

export interface SimulationMetrics {
  totalUsers: number;
  totalRequests: number;

  humanRequests: number;
  impatientRequests: number;
  botRequests: number;

  humanAllocations: number;
  botAllocations: number;

  blockedRequests: number;
  throttledRequests: number;

  duplicateAllocations: number;
  oversoldTickets: number;
}