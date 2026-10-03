import { SimulatedUser, SimulationResult } from "../types";
import { enterDrop, checkStatus } from "../client";
import { sleep } from "../utils/sleep";
import { config } from "../config";

export async function runImpatient(
  user: SimulatedUser
): Promise<SimulationResult> {
  let requests = 0;
  let enteredQueue = false;
  let blocked = false;
  let throttled = false;

  const enterResponse = await enterDrop(user.id);
  requests++;

  enteredQueue = enterResponse.ok;

  for (let i = 0; i < config.impatientStatusChecks; i++) {
    await sleep(100);

    const response = await checkStatus(user.id);
    requests++;

    if (response.status === 403) {
      blocked = true;
    }

    if (response.status === 429) {
      throttled = true;
    }
  }

  return {
    userId: user.id,
    type: "impatient",
    requests,
    enteredQueue,
    allocated: false,
    blocked,
    throttled,
    duplicateAllocation: false,
  };
}