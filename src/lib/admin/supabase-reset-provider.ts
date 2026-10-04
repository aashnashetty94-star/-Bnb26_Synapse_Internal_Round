import { ResetDatabaseProvider } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getErrorMessage(value: unknown, responseText: string): string {
  if (isRecord(value) && typeof value.message === "string") {
    return value.message;
  }
  return responseText || "No error details provided";
}

export class SupabaseResetDatabaseProvider implements ResetDatabaseProvider {
  async resetDatabase(): Promise<void> {
    if (typeof window !== "undefined") {
      throw new Error("Database reset can only run on the server");
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL is required to call reset_database");
    }
    if (!serviceRoleKey) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is required to call reset_database"
      );
    }

    let rpcUrl: URL;
    try {
      rpcUrl = new URL("/rest/v1/rpc/reset_database", supabaseUrl);
    } catch {
      throw new Error("SUPABASE_URL must be a valid absolute URL");
    }
    if (rpcUrl.protocol !== "http:" && rpcUrl.protocol !== "https:") {
      throw new Error("SUPABASE_URL must use HTTP or HTTPS");
    }

    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({}),
    });

    const responseText = await response.text();
    if (response.ok) {
      return;
    }

    let responseBody: unknown;
    if (responseText) {
      try {
        responseBody = JSON.parse(responseText);
      } catch {
        responseBody = undefined;
      }
    }

    throw new Error(
      `reset_database RPC failed with HTTP ${response.status}: ${getErrorMessage(
        responseBody,
        responseText
      )}`
    );
  }
}
