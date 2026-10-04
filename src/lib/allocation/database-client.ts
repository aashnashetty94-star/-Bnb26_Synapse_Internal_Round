import {
  AllocateTicketRequest,
  AllocateTicketResult,
  AllocationRpcClient,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAllocationResult(value: unknown): AllocateTicketResult {
  if (
    isRecord(value) &&
    value.success === true &&
    typeof value.allocation_id === "string" &&
    value.allocation_id.length > 0 &&
    typeof value.seat_id === "string" &&
    value.seat_id.length > 0
  ) {
    return {
      success: true,
      allocation_id: value.allocation_id,
      seat_id: value.seat_id,
    };
  }

  if (
    isRecord(value) &&
    value.success === false &&
    typeof value.error === "string" &&
    value.error.length > 0
  ) {
    return {
      success: false,
      error: value.error,
    };
  }

  throw new TypeError("allocate_ticket returned an invalid result");
}

function getRpcErrorMessage(value: unknown, responseText: string): string {
  if (isRecord(value) && typeof value.message === "string") {
    return value.message;
  }
  return responseText || "No error details provided";
}

export class SupabaseAllocationRpcClient implements AllocationRpcClient {
  async allocateTicket(
    request: AllocateTicketRequest
  ): Promise<AllocateTicketResult> {
    if (typeof window !== "undefined") {
      throw new Error("Supabase allocation RPCs can only run on the server");
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL is required to call allocate_ticket");
    }
    if (!serviceRoleKey) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is required to call allocate_ticket"
      );
    }

    let rpcUrl: URL;
    try {
      rpcUrl = new URL("/rest/v1/rpc/allocate_ticket", supabaseUrl);
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
      body: JSON.stringify(request),
    });

    const responseText = await response.text();
    let responseBody: unknown;
    if (responseText) {
      try {
        responseBody = JSON.parse(responseText);
      } catch {
        if (response.ok) {
          throw new TypeError("allocate_ticket returned invalid JSON");
        }
      }
    }

    if (!response.ok) {
      throw new Error(
        `allocate_ticket RPC failed with HTTP ${response.status}: ${getRpcErrorMessage(
          responseBody,
          responseText
        )}`
      );
    }

    return parseAllocationResult(responseBody);
  }
}
