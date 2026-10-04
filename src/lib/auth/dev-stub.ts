import { AuthResult } from "@/src/types/auth";
import { AuthProvider } from "./types";

/**
 * ============================================================================
 * TEMPORARY DEVELOPMENT AUTH STUB
 * ============================================================================
 *
 * CAUTION: This stub is strictly for local development and testing purposes.
 * It is NOT real authentication and MUST NOT be used in production.
 *
 * Real authentication (such as Supabase Auth or JWT provider) will replace
 * this stub once configured by the database/auth team.
 *
 * Behavior:
 * - Unauthenticated: If no Authorization header or x-user-id header is provided,
 *   it rejects the request with HTTP 401.
 * - Authenticated: If an `Authorization: Bearer <token>` header or `x-user-id` header
 *   is present, it derives a non-sensitive identity (user ID) from the credential
 *   to allow local API workflows to be tested.
 * - Sensitive info: No passwords, tokens, or secrets are stored or returned.
 */
export class DevStubAuthProvider implements AuthProvider {
  readonly name = "dev-stub";

  async authenticate(request: Request): Promise<AuthResult> {
    const authHeader = request.headers.get("authorization");
    const devUserId = request.headers.get("x-user-id");

    // Case 1: Bearer token in Authorization header
    if (authHeader) {
      if (!authHeader.startsWith("Bearer ")) {
        return {
          authenticated: false,
          error: "Invalid authorization scheme. Expected 'Bearer <token>'.",
          statusCode: 401,
        };
      }

      const token = authHeader.slice(7).trim();
      if (!token) {
        return {
          authenticated: false,
          error: "Empty bearer token provided.",
          statusCode: 401,
        };
      }

      return {
        authenticated: true,
        user: {
          id: token,
          role: "authenticated",
        },
      };
    }

    // Case 2: Development direct user header (useful for simulator testing)
    if (devUserId && devUserId.trim()) {
      return {
        authenticated: true,
        user: {
          id: devUserId.trim(),
          role: "authenticated",
        },
      };
    }

    // Case 3: No authorization credentials provided
    return {
      authenticated: false,
      error: "Authentication required. Missing authorization header.",
      statusCode: 401,
    };
  }
}
