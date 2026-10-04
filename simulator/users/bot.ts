import { SimulatedUser, SimulationResult } from "../types";
import { enterDrop } from "../client";
import { config } from "../config";
import { sleep } from "../utils/sleep";

export async function runBot(
  user: SimulatedUser
): Promise<SimulationResult> {
  let requests = 0;
  let enteredQueue = false;
  let blocked = false;
  let throttled = false;

  for (let i = 0; i < config.botJoinAttempts; i++) {
    const response = await enterDrop(user.id);

    requests++;

    if (response.ok) {
      enteredQueue = true;
    }

    if (response.status === 403) {
      blocked = true;
    }

    if (response.status === 429) {
      throttled = true;
    }

    await sleep(20);
  }

  return {
    userId: user.id,
    type: "bot",
    requests,
    enteredQueue,
    allocated: false,
    blocked,
    throttled,
    duplicateAllocation: false,
  };
}