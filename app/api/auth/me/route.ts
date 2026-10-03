import { NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/auth";

export async function GET(request: Request) {
  const { user, errorResponse } = await requireAuth(request);

  if (errorResponse) {
    return errorResponse;
  }

  // Return a safe representation of the authenticated user identity without secrets
  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
}
