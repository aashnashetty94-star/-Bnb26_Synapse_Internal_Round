import { ActivitySignals, RiskClassification, RiskLevel } from "./types";

const REQUEST_BASELINE = 10;
const POINTS_PER_EXTRA_REQUEST = 2;
const MAX_REQUEST_VOLUME_POINTS = 40;
const POINTS_PER_DUPLICATE_ATTEMPT = 15;
const MAX_DUPLICATE_POINTS = 45;
const POINTS_PER_RATE_LIMIT_HIT = 25;
const MAX_RATE_LIMIT_POINTS = 75;
const POINTS_PER_RAPID_REQUEST = 10;
const MAX_RAPID_REQUEST_POINTS = 40;

function validateSignals(signals: ActivitySignals): void {
  if (typeof signals !== "object" || signals === null) {
    throw new RangeError("Activity signals must be an object");
  }

  for (const name of [
    "requestCount",
    "duplicateAttempts",
    "rateLimitHits",
    "rapidRequests",
  ] as const) {
    const value = signals[name];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      throw new RangeError(`${name} must be a finite number greater than or equal to 0`);
    }
  }
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) {
    return "BOT";
  }
  if (score >= 30) {
    return "SUSPICIOUS";
  }
  return "NORMAL";
}

export function classifyRisk(signals: ActivitySignals): RiskClassification {
  validateSignals(signals);

  let score = 0;
  const reasons: string[] = [];

  const extraRequests = Math.max(0, signals.requestCount - REQUEST_BASELINE);
  const requestVolumePoints = Math.min(
    extraRequests * POINTS_PER_EXTRA_REQUEST,
    MAX_REQUEST_VOLUME_POINTS
  );
  if (requestVolumePoints > 0) {
    score += requestVolumePoints;
    reasons.push(
      `High request volume (${signals.requestCount} requests) added ${requestVolumePoints} points.`
    );
  }

  const duplicatePoints = Math.min(
    signals.duplicateAttempts * POINTS_PER_DUPLICATE_ATTEMPT,
    MAX_DUPLICATE_POINTS
  );
  if (duplicatePoints > 0) {
    score += duplicatePoints;
    reasons.push(
      `${signals.duplicateAttempts} duplicate attempt(s) added ${duplicatePoints} points.`
    );
  }

  const rateLimitPoints = Math.min(
    signals.rateLimitHits * POINTS_PER_RATE_LIMIT_HIT,
    MAX_RATE_LIMIT_POINTS
  );
  if (rateLimitPoints > 0) {
    score += rateLimitPoints;
    reasons.push(
      `${signals.rateLimitHits} rate-limit violation(s) added ${rateLimitPoints} points.`
    );
  }

  const rapidRequestPoints = Math.min(
    signals.rapidRequests * POINTS_PER_RAPID_REQUEST,
    MAX_RAPID_REQUEST_POINTS
  );
  if (rapidRequestPoints > 0) {
    score += rapidRequestPoints;
    reasons.push(
      `${signals.rapidRequests} rapid repeated request(s) added ${rapidRequestPoints} points.`
    );
  }

  score = Math.min(score, 100);
  if (reasons.length === 0) {
    reasons.push("No suspicious activity was detected.");
  }

  return {
    level: getRiskLevel(score),
    score,
    reasons,
  };
}
