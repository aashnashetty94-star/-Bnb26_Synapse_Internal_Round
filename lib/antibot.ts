import {
  AntiBotResult,
  UserActivity,
  UserRiskState,
} from "../types/antibot";

const activityStore = new Map<string, UserActivity>();

const WINDOW_MS = 10_000;

const SUSPICIOUS_REQUESTS = 5;
const THROTTLE_REQUESTS = 10;
const BLOCK_REQUESTS = 20;

const BLOCK_DURATION_MS = 30_000;

function getActivity(userId: string): UserActivity {
  let activity = activityStore.get(userId);

  if (!activity) {
    activity = {
      userId,
      timestamps: [],
      duplicateJoins: 0,
      state: "NORMAL",
    };

    activityStore.set(userId, activity);
  }

  return activity;
}

function cleanOldRequests(activity: UserActivity, now: number) {
  activity.timestamps = activity.timestamps.filter(
    (timestamp) => now - timestamp <= WINDOW_MS
  );
}

export function checkRequest(
  userId: string,
  isDuplicateJoin = false
): AntiBotResult {
  const now = Date.now();

  const activity = getActivity(userId);

  // Check whether the user is currently blocked
  if (
    activity.state === "BLOCKED" &&
    activity.blockedUntil &&
    now < activity.blockedUntil
  ) {
    return {
      allowed: false,
      state: "BLOCKED",
      statusCode: 403,
    reason: "User temporarily blocked for excessive requests",
    };
  }

  // Reset an expired block
  if (
    activity.state === "BLOCKED" &&
    activity.blockedUntil &&
    now >= activity.blockedUntil
  ) {
    activity.state = "NORMAL";
    activity.blockedUntil = undefined;
    activity.timestamps = [];
    activity.duplicateJoins = 0;
  }

  cleanOldRequests(activity, now);

  activity.timestamps.push(now);

  if (isDuplicateJoin) {
    activity.duplicateJoins++;
  }

  const requestCount = activity.timestamps.length;

  // Too many requests -> block
  if (requestCount >= BLOCK_REQUESTS) {
    activity.state = "BLOCKED";
    activity.blockedUntil = now + BLOCK_DURATION_MS;

    return {
      allowed: false,
      state: "BLOCKED",
      statusCode: 403,
      reason: "User blocked for excessive request activity",
    };
  }

  // High request rate -> throttle
  if (requestCount >= THROTTLE_REQUESTS) {
    activity.state = "THROTTLED";

    return {
      allowed: false,
      state: "THROTTLED",
      statusCode: 429,
      reason: "Too many requests. User temporarily throttled",
    };
  }

  // Repeated duplicate joins -> suspicious
  if (
    requestCount >= SUSPICIOUS_REQUESTS ||
    activity.duplicateJoins >= 2
  ) {
    activity.state = "SUSPICIOUS";

    return {
      allowed: true,
      state: "SUSPICIOUS",
      statusCode: 200,
      reason: "Suspicious request pattern detected",
    };
  }

  activity.state = "NORMAL";

  return {
    allowed: true,
    state: "NORMAL",
    statusCode: 200,
    reason: "Request allowed",
  };
}

export function resetAntiBotState() {
  activityStore.clear();
}