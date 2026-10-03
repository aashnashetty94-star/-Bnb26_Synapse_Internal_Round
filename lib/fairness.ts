const queueUsers = new Set<string>();

const allocatedUsers = new Set<string>();

const allocatedTickets = new Set<string>();

export function hasQueueEntry(userId: string): boolean {
  return queueUsers.has(userId);
}

export function addQueueEntry(userId: string): boolean {
  // Prevent duplicate queue positions
  if (queueUsers.has(userId)) {
    return false;
  }

  queueUsers.add(userId);

  return true;
}

export function hasAllocation(userId: string): boolean {
  return allocatedUsers.has(userId);
}

export function allocateTicket(
  userId: string,
  ticketId: string
): boolean {
  // One user cannot receive multiple tickets
  if (allocatedUsers.has(userId)) {
    return false;
  }

  // One ticket cannot be allocated twice
  if (allocatedTickets.has(ticketId)) {
    return false;
  }

  allocatedUsers.add(userId);
  allocatedTickets.add(ticketId);

  return true;
}

export function resetFairnessState() {
  queueUsers.clear();
  allocatedUsers.clear();
  allocatedTickets.clear();
}