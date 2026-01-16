import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json({
      error: "Missing env vars",
      hasUrl: !!url,
      hasKey: !!key,
    });
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from("products").select("id, name").limit(5);

    if (error) {
      return NextResponse.json({
        error: "Supabase query failed",
        details: error.message,
        code: error.code,
        hint: error.hint,
      });
    }

    return NextResponse.json({
      success: true,
      productCount: data?.length || 0,
      products: data,
    });
  } catch (e) {
    return NextResponse.json({
      error: "Exception",
      message: e instanceof Error ? e.message : "Unknown",
    });
  }
}
// Trigger redeploy Fri Jan 16 10:42:21 CET 2026
