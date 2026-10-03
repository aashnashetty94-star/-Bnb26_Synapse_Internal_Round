import { runSimulation } from "../simulator/simulator";
import { collectMetrics } from "../simulator/metrics/collector";
import { printReport } from "../simulator/metrics/reporter";

async function main() {
  console.log("Starting simulation...");

  const results = await runSimulation();

  const metrics = collectMetrics(results);

  printReport(metrics);
}

main().catch((error) => {
  console.error("Simulation failed:", error);
  process.exit(1);
});