import { requireAuth } from "@/src/lib/auth";
import {
  getDashboardStats,
  SupabaseDashboardStatsProvider,
} from "@/src/lib/stats";
import { NextResponse } from "next/server";

const dashboardStatsProvider = new SupabaseDashboardStatsProvider();

export async function GET(request: Request) {
  try {
    const { errorResponse } = await requireAuth(request);
    if (errorResponse) {
      return errorResponse;
    }

    const stats = await getDashboardStats({
      databaseStatsProvider: dashboardStatsProvider,
    });
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in /api/stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred while retrieving dashboard statistics",
      },
      { status: 500 }
    );
  }
}
