import { NextResponse } from "next/server";
import { AuthResult, AuthUser } from "@/src/types/auth";
import { AuthProvider, RequireAuthResult } from "./types";
import { DevStubAuthProvider } from "./dev-stub";

// Default to the clearly isolated temporary development stub
let activeAuthProvider: AuthProvider = new DevStubAuthProvider();

/**
 * Configure or swap the active authentication provider.
 * Allows seamless transition when the database/Supabase provider is implemented.
 */
export function setAuthProvider(provider: AuthProvider): void {
  activeAuthProvider = provider;
}

/**
 * Get the currently active authentication provider instance.
 */
export function getAuthProvider(): AuthProvider {
  return activeAuthProvider;
}

/**
 * Verifies authentication on an incoming HTTP Request.
 * Returns an AuthResult indicating success or failure.
 */
export async function verifyAuth(request: Request): Promise<AuthResult> {
  return activeAuthProvider.authenticate(request);
}

/**
 * Retrieves the authenticated user identity, or null if unauthenticated.
 */
export async function getAuthenticatedUser(request: Request): Promise<AuthUser | null> {
  const result = await verifyAuth(request);
  return result.authenticated ? result.user : null;
}

/**
 * Guard utility for Route Handlers to enforce authentication.
 * Returns { user, errorResponse: null } if authenticated,
 * or { user: null, errorResponse: NextResponse } (401/403) to return directly.
 */
export async function requireAuth(request: Request): Promise<RequireAuthResult> {
  const result = await verifyAuth(request);

  if (!result.authenticated) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        {
          error: "Unauthorized",
          message: result.error,
        },
        { status: result.statusCode }
      ),
    };
  }

  return {
    user: result.user,
    errorResponse: null,
  };
}

export * from "./types";
export * from "./dev-stub";
export * from "@/src/types/auth";
