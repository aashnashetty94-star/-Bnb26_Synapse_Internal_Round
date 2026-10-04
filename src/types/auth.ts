/**
 * Safe representation of an authenticated user identity.
 * Strictly excludes sensitive credentials such as passwords, hashes, or secret tokens.
 */
export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
}

/**
 * Session details for an authenticated user request.
 */
export interface AuthSession {
  user: AuthUser;
  expiresAt?: string;
}

/**
 * Result of verifying authentication on an incoming request.
 */
export type AuthResult =
  | {
      authenticated: true;
      user: AuthUser;
      session?: AuthSession;
    }
  | {
      authenticated: false;
      error: string;
      statusCode: 401 | 403;
    };
