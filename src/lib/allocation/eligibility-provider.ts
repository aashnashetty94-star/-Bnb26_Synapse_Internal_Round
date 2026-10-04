import { EligibleUser, EligibleUserProvider } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

function parseEligibleUsers(value: unknown): EligibleUser[] {
  if (!Array.isArray(value)) {
    throw new TypeError("Eligible registrations response must be an array");
  }

  return value.map((row, index) => {
    if (!isRecord(row) || typeof row.user_id !== "string" || !isUuid(row.user_id)) {
      throw new TypeError(
        `Eligible registrations response contains an invalid user_id at row ${index}`
      );
    }

    return { id: row.user_id };
  });
}

function getErrorMessage(value: unknown, responseText: string): string {
  if (isRecord(value) && typeof value.message === "string") {
    return value.message;
  }
  return responseText || "No error details provided";
}

export class SupabaseEligibleUserProvider implements EligibleUserProvider {
  async getEligibleUsers(eventId: string): Promise<EligibleUser[]> {
    if (typeof eventId !== "string" || !isUuid(eventId)) {
      throw new TypeError("eventId must be a valid UUID");
    }

    if (typeof window !== "undefined") {
      throw new Error("Eligible users can only be fetched on the server");
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL is required to query eligible registrations");
    }
    if (!serviceRoleKey) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is required to query eligible registrations"
      );
    }

    let queryUrl: URL;
    try {
      queryUrl = new URL("/rest/v1/registrations", supabaseUrl);
    } catch {
      throw new Error("SUPABASE_URL must be a valid absolute URL");
    }
    if (queryUrl.protocol !== "http:" && queryUrl.protocol !== "https:") {
      throw new Error("SUPABASE_URL must use HTTP or HTTPS");
    }

    queryUrl.searchParams.set("select", "user_id");
    queryUrl.searchParams.set("event_id", `eq.${eventId}`);
    queryUrl.searchParams.set("status", "eq.eligible");

    const response = await fetch(queryUrl, {
      method: "GET",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Accept: "application/json",
      },
    });

    const responseText = await response.text();
    let responseBody: unknown;
    if (responseText) {
      try {
        responseBody = JSON.parse(responseText);
      } catch {
        if (response.ok) {
          throw new TypeError("Eligible registrations response was invalid JSON");
        }
      }
    }

    if (!response.ok) {
      throw new Error(
        `Eligible registrations query failed with HTTP ${response.status}: ${getErrorMessage(
          responseBody,
          responseText
        )}`
      );
    }

    return parseEligibleUsers(responseBody);
  }
}
