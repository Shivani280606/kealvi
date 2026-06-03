import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    error:
      "Vote API temporarily disabled. Configure Supabase voting first.",
  });
}