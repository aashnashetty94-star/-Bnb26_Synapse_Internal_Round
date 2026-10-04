import { classifyRisk } from "./classifier";
import { ActivitySignals, RiskClassification } from "./types";

declare global {
  var __fairdrop_activity_tracker__:
    | Map<string, ActivitySignals>
    | undefined;
}

const activityByUser =
  (globalThis.__fairdrop_activity_tracker__ ??=
    new Map<string, ActivitySignals>());

function getOrCreateActivity(userId: string): ActivitySignals {
  let activity = activityByUser.get(userId);
  if (!activity) {
    activity = {
      requestCount: 0,
      duplicateAttempts: 0,
      rateLimitHits: 0,
      rapidRequests: 0,
    };
    activityByUser.set(userId, activity);
  }
  return activity;
}

function incrementSignal(
  userId: string,
  signal: keyof ActivitySignals
): void {
  getOrCreateActivity(userId)[signal] += 1;
}

export function recordRequest(userId: string): void {
  incrementSignal(userId, "requestCount");
}

export function recordDuplicateAttempt(userId: string): void {
  incrementSignal(userId, "duplicateAttempts");
}

export function recordRateLimitHit(userId: string): void {
  incrementSignal(userId, "rateLimitHits");
}

export function recordRapidRequest(userId: string): void {
  incrementSignal(userId, "rapidRequests");
}

export function getActivitySignals(userId: string): ActivitySignals {
  const activity = activityByUser.get(userId);
  return activity
    ? { ...activity }
    : {
        requestCount: 0,
        duplicateAttempts: 0,
        rateLimitHits: 0,
        rapidRequests: 0,
      };
}

export function getRiskClassification(
  userId: string
): RiskClassification {
  return classifyRisk(getActivitySignals(userId));
}

export function clearActivityState(): void {
  activityByUser.clear();
}
