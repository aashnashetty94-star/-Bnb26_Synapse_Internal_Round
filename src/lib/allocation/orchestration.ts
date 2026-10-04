import { allocateTicket } from "./service";
import { selectRandomEligibleUsers } from "./random-selector";
import {
  AllocationRunDependencies,
  AllocationRunResult,
  EligibleUser,
  FailedAllocation,
  SuccessfulAllocation,
} from "./types";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

const defaultDependencies: AllocationRunDependencies = {
  selectUsers: selectRandomEligibleUsers,
  allocateUser: allocateTicket,
};

/**
 * Selects from a trusted backend-provided eligible-user list and submits one
 * database allocation request per selected user. It does not fetch eligibility,
 * allocate seats itself, retry failures, or stop when an individual request fails.
 */
export async function runAllocation(
  eligibleUsers: readonly EligibleUser[],
  capacity: number,
  dependencies: Partial<AllocationRunDependencies> = {}
): Promise<AllocationRunResult> {
  const { selectUsers, allocateUser } = {
    ...defaultDependencies,
    ...dependencies,
  };
  const selectedUsers = selectUsers(eligibleUsers, capacity);
  const successfulAllocations: SuccessfulAllocation[] = [];
  const failedAllocations: FailedAllocation[] = [];

  for (const user of selectedUsers) {
    try {
      const result = await allocateUser(user.id);
      if (result.success) {
        successfulAllocations.push({
          user,
          allocation_id: result.allocation_id,
          seat_id: result.seat_id,
        });
      } else {
        failedAllocations.push({ user, error: result.error });
      }
    } catch (error) {
      failedAllocations.push({ user, error: errorMessage(error) });
    }
  }

  return {
    selectedUsers,
    successfulAllocations,
    failedAllocations,
    requestedCapacity: capacity,
    selectedCount: selectedUsers.length,
    successfulCount: successfulAllocations.length,
    failedCount: failedAllocations.length,
  };
}
