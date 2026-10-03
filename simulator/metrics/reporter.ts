import { SimulationMetrics } from "../types";

export function printReport(
  metrics: SimulationMetrics
): void {
  console.log("\n========== SIMULATION REPORT ==========\n");

  console.log(`Total users: ${metrics.totalUsers}`);
  console.log(`Total requests: ${metrics.totalRequests}`);

  console.log("\n--- Requests by user type ---");

  console.log(`Human requests: ${metrics.humanRequests}`);
  console.log(`Impatient requests: ${metrics.impatientRequests}`);
  console.log(`Bot requests: ${metrics.botRequests}`);

  console.log("\n--- Allocations ---");

  console.log(
    `Human allocations: ${metrics.humanAllocations}`
  );

  console.log(
    `Bot allocations: ${metrics.botAllocations}`
  );

  console.log("\n--- Protection ---");

  console.log(
    `Blocked requests: ${metrics.blockedRequests}`
  );

  console.log(
    `Throttled requests: ${metrics.throttledRequests}`
  );

  console.log("\n--- Integrity ---");

  console.log(
    `Duplicate allocations: ${metrics.duplicateAllocations}`
  );

  console.log(
    `Oversold tickets: ${metrics.oversoldTickets}`
  );

  console.log("\n=======================================\n");
}