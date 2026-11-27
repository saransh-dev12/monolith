import { NextResponse } from "next/server";

import { getSupabaseConfig } from "@/lib/env";

export const dynamic = "force-dynamic";

/**
 * Unauthenticated health probe. Reports whether the app can reach the
 * Supabase auth service. This does not probe the database: callers must not
 * treat a successful response as evidence of database readiness.
 */
export async function GET() {
  try {
    const { url, publishableKey } = getSupabaseConfig();
    const response = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: publishableKey },
      cache: "no-store",
    });
    const body = (await response.json().catch(() => ({}))) as {
      name?: string;
    };

    if (!response.ok) {
      return NextResponse.json(
        { status: "degraded", auth: "unreachable", database: "unverified", timestamp: new Date().toISOString() },
        { status: 503 },
      );
    }

    return NextResponse.json({
      status: "ok",
      auth: "reachable",
      database: "unverified",
      service: body.name ?? "supabase-auth",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { status: "degraded", auth: "unreachable", database: "unverified", timestamp: new Date().toISOString() },
      { status: 503 },
    );
  }
}
