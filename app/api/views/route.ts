import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const SESSION_ID_RE = /^[a-zA-Z0-9_-]{1,128}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  let body: { productId?: string; sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const { productId, sessionId } = body;
  if (
    typeof productId !== "string" ||
    typeof sessionId !== "string" ||
    !UUID_RE.test(productId) ||
    !SESSION_ID_RE.test(sessionId)
  ) {
    return new NextResponse(null, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return new NextResponse(null, { status: 503 });
  }

  const { error } = await supabase
    .from("product_views")
    .insert({ product_id: productId, session_id: sessionId });

  // Silently ignore unique violation (23505) and FK violation (23503)
  if (error && error.code !== "23505" && error.code !== "23503") {
    return new NextResponse(null, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
