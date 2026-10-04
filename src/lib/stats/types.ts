export type DashboardMetricAvailability = "available" | "unavailable";

export interface DashboardMetric {
  value: number | null;
  availability: DashboardMetricAvailability;
}

export interface DashboardStats {
  totalUsers: DashboardMetric;
  totalRequests: DashboardMetric;
  normalUsers: DashboardMetric;
  suspiciousUsers: DashboardMetric;
  botUsers: DashboardMetric;
  blockedRequests: DashboardMetric;
  successfulAllocations: DashboardMetric;
  humanAllocations: DashboardMetric;
  botAllocations: DashboardMetric;
  duplicateAttempts: DashboardMetric;
  duplicateAllocations: DashboardMetric;
  overselling: DashboardMetric;
}

/**
 * Values currently provided by the database dashboard-statistics contract.
 * totalAllocations represents allocations successfully created by the RPC.
 */
export interface DatabaseDashboardStats {
  totalUsers: number;
  totalAllocations: number;
}

export interface DashboardStatsProvider {
  getDashboardStats(): Promise<DatabaseDashboardStats>;
}

export interface DashboardStatsDependencies {
  databaseStatsProvider?: DashboardStatsProvider;
  /**
   * Complete user population whose in-memory activity should be aggregated.
   */
  activityUserIds?: readonly string[];
}
