import { NextResponse, type NextRequest } from "next/server";

import { safeNextPath } from "@/lib/auth/safe-next-path";
import { createClient } from "@/lib/supabase/server";


export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = safeNextPath(searchParams.get("next"));

  if (!code && !tokenHash) {
    return NextResponse.redirect(
      new URL("/login?error=missing-code", origin),
    );
  }

  const supabase = await createClient();

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({
        type: type as "signup" | "email" | "recovery" | "invite" | "magiclink",
        token_hash: tokenHash ?? "",
      });

  if (error) {
    return NextResponse.redirect(new URL("/login?error=callback", origin));
  }

  return NextResponse.redirect(new URL(next, origin));
}
