import {
  getActivitySignals,
  getRiskClassification,
} from "@/src/lib/risk";
import {
  DashboardMetric,
  DashboardStats,
  DashboardStatsDependencies,
  DatabaseDashboardStats,
} from "./types";

function available(value: number): DashboardMetric {
  return { value, availability: "available" };
}

function unavailable(): DashboardMetric {
  return { value: null, availability: "unavailable" };
}

function validateDatabaseStats(stats: DatabaseDashboardStats): void {
  for (const [name, value] of Object.entries(stats)) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      throw new RangeError(
        `Database dashboard statistic ${name} must be a finite non-negative number`
      );
    }
  }
}

export async function getDashboardStats(
  dependencies: DashboardStatsDependencies = {}
): Promise<DashboardStats> {
  let totalUsers = unavailable();
  let successfulAllocations = unavailable();

  if (dependencies.databaseStatsProvider) {
    const databaseStats =
      await dependencies.databaseStatsProvider.getDashboardStats();
    validateDatabaseStats(databaseStats);
    totalUsers = available(databaseStats.totalUsers);
    successfulAllocations = available(databaseStats.totalAllocations);
  }

  let totalRequests = unavailable();
  let normalUsers = unavailable();
  let suspiciousUsers = unavailable();
  let botUsers = unavailable();
  let blockedRequests = unavailable();
  let duplicateAttempts = unavailable();

  if (dependencies.activityUserIds) {
    const userIds = new Set<string>();
    for (const userId of dependencies.activityUserIds) {
      if (typeof userId !== "string" || userId.trim().length === 0) {
        throw new TypeError("Activity user IDs must be non-empty strings");
      }
      userIds.add(userId);
    }

    let requestCount = 0;
    let rateLimitHits = 0;
    let duplicateAttemptCount = 0;
    let normalUserCount = 0;
    let suspiciousUserCount = 0;
    let botUserCount = 0;

    for (const userId of userIds) {
      const activity = getActivitySignals(userId);
      requestCount += activity.requestCount;
      rateLimitHits += activity.rateLimitHits;
      duplicateAttemptCount += activity.duplicateAttempts;

      const { level } = getRiskClassification(userId);
      if (level === "NORMAL") {
        normalUserCount += 1;
      } else if (level === "SUSPICIOUS") {
        suspiciousUserCount += 1;
      } else {
        botUserCount += 1;
      }
    }

    totalRequests = available(requestCount);
    normalUsers = available(normalUserCount);
    suspiciousUsers = available(suspiciousUserCount);
    botUsers = available(botUserCount);
    blockedRequests = available(rateLimitHits);
    duplicateAttempts = available(duplicateAttemptCount);
  }

  return {
    totalUsers,
    totalRequests,
    normalUsers,
    suspiciousUsers,
    botUsers,
    blockedRequests,
    successfulAllocations,
    humanAllocations: unavailable(),
    botAllocations: unavailable(),
    duplicateAttempts,
    duplicateAllocations: unavailable(),
    overselling: unavailable(),
  };
}
