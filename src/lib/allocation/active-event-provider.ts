export type DatabaseEventStatus = "registration" | "allocation" | "closed";

export interface ActiveEvent {
  eventId: string;
  status: DatabaseEventStatus;
}

export interface ActiveEventProvider {
  getActiveEvent(): Promise<ActiveEvent | null>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

function parseActiveEvents(value: unknown): ActiveEvent[] {
  if (!Array.isArray(value)) {
    throw new TypeError("Active events response must be an array");
  }

  return value.map((row, index) => {
    if (!isRecord(row) || typeof row.event_id !== "string" || !isUuid(row.event_id)) {
      throw new TypeError(
        `Active events response contains an invalid event_id at row ${index}`
      );
    }

    if (
      row.status !== "registration" &&
      row.status !== "allocation" &&
      row.status !== "closed"
    ) {
      throw new TypeError(
        `Active events response contains an invalid status at row ${index}`
      );
    }

    return { eventId: row.event_id, status: row.status };
  });
}

function getErrorMessage(value: unknown, responseText: string): string {
  if (isRecord(value) && typeof value.message === "string") {
    return value.message;
  }
  return responseText || "No error details provided";
}

export class SupabaseActiveEventProvider implements ActiveEventProvider {
  async getActiveEvent(): Promise<ActiveEvent | null> {
    if (typeof window !== "undefined") {
      throw new Error("Active events can only be fetched on the server");
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL is required to query active events");
    }
    if (!serviceRoleKey) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is required to query active events"
      );
    }

    let queryUrl: URL;
    try {
      queryUrl = new URL("/rest/v1/events", supabaseUrl);
    } catch {
      throw new Error("SUPABASE_URL must be a valid absolute URL");
    }
    if (queryUrl.protocol !== "http:" && queryUrl.protocol !== "https:") {
      throw new Error("SUPABASE_URL must use HTTP or HTTPS");
    }

    queryUrl.searchParams.set("select", "event_id,status");
    queryUrl.searchParams.set("status", "neq.closed");
    queryUrl.searchParams.set("limit", "2");

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
          throw new TypeError("Active events response was invalid JSON");
        }
      }
    }

    if (!response.ok) {
      throw new Error(
        `Active events query failed with HTTP ${response.status}: ${getErrorMessage(
          responseBody,
          responseText
        )}`
      );
    }

    const activeEvents = parseActiveEvents(responseBody);
    if (activeEvents.length > 1) {
      throw new Error("Multiple active events were found");
    }

    return activeEvents[0] ?? null;
  }
}
