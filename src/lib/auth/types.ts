import { AuthResult, AuthUser } from "@/src/types/auth";
import { NextResponse } from "next/server";

/**
 * Provider-agnostic contract for authentication strategies.
 * Allows decoupling backend route handlers from specific providers (e.g. Supabase, OAuth).
 */
export interface AuthProvider {
  readonly name: string;
  authenticate(request: Request): Promise<AuthResult>;
}

/**
 * Guard result returned by requireAuth helper.
 */
export type RequireAuthResult =
  | {
      user: AuthUser;
      errorResponse: null;
    }
  | {
      user: null;
      errorResponse: NextResponse;
    };
