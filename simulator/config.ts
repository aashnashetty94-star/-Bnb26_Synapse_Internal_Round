export const config = {
  baseUrl: process.env.SIMULATOR_BASE_URL || "http://localhost:3000",

  totalUsers: Number(process.env.SIMULATOR_USERS || 100),

  seats: Number(process.env.SIMULATOR_SEATS || 50),

  humanPercentage: 70,
  impatientPercentage: 20,
  botPercentage: 10,

  botJoinAttempts: 50,
  impatientStatusChecks: 10,

  delayBetweenRequestsMs: 100,
};