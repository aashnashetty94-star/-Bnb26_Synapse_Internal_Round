import { EligibleUser } from "./types";

/**
 * Randomly selects eligible users only; it does not allocate physical or
 * database seats.
 */
export function selectRandomEligibleUsers(
  eligibleUsers: readonly EligibleUser[],
  capacity: number
): EligibleUser[] {
  if (!Number.isSafeInteger(capacity) || capacity <= 0) {
    throw new RangeError("capacity must be a positive integer");
  }

  if (!Array.isArray(eligibleUsers)) {
    throw new TypeError("eligibleUsers must be an array");
  }

  const uniqueUsers: EligibleUser[] = [];
  const seenUserIds = new Set<string>();

  for (const user of eligibleUsers) {
    if (
      typeof user !== "object" ||
      user === null ||
      typeof user.id !== "string" ||
      user.id.trim().length === 0
    ) {
      throw new TypeError("Each eligible user must have a non-empty string id");
    }

    if (!seenUserIds.has(user.id)) {
      seenUserIds.add(user.id);
      uniqueUsers.push(user);
    }
  }

  const selectionCount = Math.min(capacity, uniqueUsers.length);

  for (let index = 0; index < selectionCount; index += 1) {
    const randomIndex =
      index + Math.floor(Math.random() * (uniqueUsers.length - index));
    [uniqueUsers[index], uniqueUsers[randomIndex]] = [
      uniqueUsers[randomIndex],
      uniqueUsers[index],
    ];
  }

  return uniqueUsers.slice(0, selectionCount);
}