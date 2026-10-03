import { NextResponse } from "next/server";
import { getEventStatus } from "@/src/lib/event-state";

export async function GET() {
  const status = await getEventStatus();
  return NextResponse.json(status);
}
