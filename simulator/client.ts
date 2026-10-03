import { config } from "./config";

async function request(
  path: string,
  options?: RequestInit
) {
  const response = await fetch(`${config.baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    // Response has no JSON body.
  }

  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}

export async function enterDrop(userId: string) {
  return request("/api/drop/enter", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export async function checkStatus(userId: string) {
  return request(
    `/api/drop/status?userId=${encodeURIComponent(userId)}`
  );
}

export async function allocate(userId: string) {
  return request("/api/drop/allocate", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export async function getStats() {
  return request("/api/stats");
}

export async function resetDrop() {
  return request("/api/admin/reset", {
    method: "POST",
  });
}