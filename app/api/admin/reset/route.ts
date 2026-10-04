import { requireAuth } from "@/src/lib/auth";
import { resetSystem } from "@/src/lib/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { errorResponse } = await requireAuth(request);
    if (errorResponse) {
      return errorResponse;
    }

    await resetSystem();
    return NextResponse.json({
      success: true,
      message: "System reset successfully",
    });
  } catch (error) {
    console.error("Unexpected error in /api/admin/reset:", error);
    return NextResponse.json(
      {
        success: false,
        error: "RESET_FAILED",
        message: "The system reset could not be completed",
      },
      { status: 500 }
    );
  }
}
