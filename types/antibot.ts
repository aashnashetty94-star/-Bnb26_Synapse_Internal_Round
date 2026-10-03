export type UserRiskState =
  | "NORMAL"
  | "SUSPICIOUS"
  | "THROTTLED"
  | "BLOCKED";

export interface UserActivity {
  userId: string;
  timestamps: number[];
  duplicateJoins: number;
  state: UserRiskState;
  blockedUntil?: number;
}

export interface AntiBotResult {
  allowed: boolean;
  state: UserRiskState;
  statusCode: number;
  reason: string;
}