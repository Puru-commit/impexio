import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Open /api/health to check that the website can reach the database.
export async function GET() {
  try {
    await db.query("SELECT 1");
    return NextResponse.json({ ok: true, database: "connected" });
  } catch {
    return NextResponse.json(
      { ok: false, database: "not reachable" },
      { status: 503 },
    );
  }
}
