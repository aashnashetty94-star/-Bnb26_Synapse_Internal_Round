import { config } from "./config";
import { SimulatedUser, SimulationResult } from "./types";
import { runHuman } from "./users/human";
import { runImpatient } from "./users/impatient";
import { runBot } from "./users/bot";

function createUsers(): SimulatedUser[] {
  const users: SimulatedUser[] = [];

  const humanCount = Math.floor(
    config.totalUsers * (config.humanPercentage / 100)
  );

  const impatientCount = Math.floor(
    config.totalUsers * (config.impatientPercentage / 100)
  );

  const botCount = config.totalUsers - humanCount - impatientCount;

  for (let i = 0; i < humanCount; i++) {
    users.push({
      id: `human-${i + 1}`,
      type: "human",
    });
  }

  for (let i = 0; i < impatientCount; i++) {
    users.push({
      id: `impatient-${i + 1}`,
      type: "impatient",
    });
  }

  for (let i = 0; i < botCount; i++) {
    users.push({
      id: `bot-${i + 1}`,
      type: "bot",
    });
  }

  return users;
}

export async function runSimulation(): Promise<SimulationResult[]> {
  const users = createUsers();

  console.log(`Simulating ${users.length} users...`);

  const results = await Promise.all(
    users.map(async (user) => {
      if (user.type === "human") {
        return runHuman(user);
      }

      if (user.type === "impatient") {
        return runImpatient(user);
      }

      return runBot(user);
    })
  );

  return results;
}