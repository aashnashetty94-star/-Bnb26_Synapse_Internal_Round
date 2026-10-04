import { SimulatedUser, SimulationResult } from "../types";
import { enterDrop, checkStatus } from "../client";
import { sleep } from "../utils/sleep";
import { randomDelay } from "../utils/random";

export async function runHuman(
  user: SimulatedUser
): Promise<SimulationResult> {
  let requests = 0;
  let enteredQueue = false;

  const enterResponse = await enterDrop(user.id);
  requests++;

  enteredQueue = enterResponse.ok;

  await sleep(randomDelay(100, 500));

  const statusResponse = await checkStatus(user.id);
  requests++;

  return {
    userId: user.id,
    type: "human",
    requests,
    enteredQueue,
    allocated: false,
    blocked: statusResponse.status === 403,
    throttled: statusResponse.status === 429,
    duplicateAllocation: false,
  };
}