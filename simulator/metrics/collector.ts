import {
  SimulationMetrics,
  SimulationResult,
} from "../types";

export function collectMetrics(
  results: SimulationResult[]
): SimulationMetrics {
  const metrics: SimulationMetrics = {
    totalUsers: results.length,
    totalRequests: 0,

    humanRequests: 0,
    impatientRequests: 0,
    botRequests: 0,

    humanAllocations: 0,
    botAllocations: 0,

    blockedRequests: 0,
    throttledRequests: 0,

    duplicateAllocations: 0,
    oversoldTickets: 0,
  };

  for (const result of results) {
    metrics.totalRequests += result.requests;

    if (result.type === "human") {
      metrics.humanRequests += result.requests;

      if (result.allocated) {
        metrics.humanAllocations++;
      }
    }

    if (result.type === "impatient") {
      metrics.impatientRequests += result.requests;
    }

    if (result.type === "bot") {
      metrics.botRequests += result.requests;

      if (result.allocated) {
        metrics.botAllocations++;
      }
    }

    if (result.blocked) {
      metrics.blockedRequests++;
    }

    if (result.throttled) {
      metrics.throttledRequests++;
    }

    if (result.duplicateAllocation) {
      metrics.duplicateAllocations++;
    }
  }

  return metrics;
}