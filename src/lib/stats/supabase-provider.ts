import { DashboardStatsProvider, DatabaseDashboardStats } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseDashboardStats(value: unknown): DatabaseDashboardStats {
  if (!isRecord(value)) {
    throw new TypeError("get_dashboard_stats returned an invalid result");
  }

  const { totalUsers, totalAllocations } = value;
  if (
    typeof totalUsers !== "number" ||
    !Number.isFinite(totalUsers) ||
    totalUsers < 0
  ) {
    throw new RangeError(
      "get_dashboard_stats returned an invalid totalUsers value"
    );
  }
  if (
    typeof totalAllocations !== "number" ||
    !Number.isFinite(totalAllocations) ||
    totalAllocations < 0
  ) {
    throw new RangeError(
      "get_dashboard_stats returned an invalid totalAllocations value"
    );
  }

  return { totalUsers, totalAllocations };
}

function getRpcErrorMessage(value: unknown, responseText: string): string {
  if (isRecord(value) && typeof value.message === "string") {
    return value.message;
  }
  return responseText || "No error details provided";
}

export class SupabaseDashboardStatsProvider
  implements DashboardStatsProvider
{
  async getDashboardStats(): Promise<DatabaseDashboardStats> {
    if (typeof window !== "undefined") {
      throw new Error(
        "Supabase dashboard statistics can only be fetched on the server"
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error(
        "SUPABASE_URL is required to call get_dashboard_stats"
      );
    }
    if (!serviceRoleKey) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is required to call get_dashboard_stats"
      );
    }

    let rpcUrl: URL;
    try {
      rpcUrl = new URL("/rest/v1/rpc/get_dashboard_stats", supabaseUrl);
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
    let responseBody: unknown;
    if (responseText) {
      try {
        responseBody = JSON.parse(responseText);
      } catch {
        if (response.ok) {
          throw new TypeError("get_dashboard_stats returned invalid JSON");
        }
      }
    }

    if (!response.ok) {
      throw new Error(
        `get_dashboard_stats RPC failed with HTTP ${response.status}: ${getRpcErrorMessage(
          responseBody,
          responseText
        )}`
      );
    }

    return parseDashboardStats(responseBody);
  }
}
