export type RiskLevel = "NORMAL" | "SUSPICIOUS" | "BOT";

export interface ActivitySignals {
  requestCount: number;
  duplicateAttempts: number;
  rateLimitHits: number;
  rapidRequests: number;
}

export interface RiskClassification {
  level: RiskLevel;
  score: number;
  reasons: string[];
}
