import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isStripeConfigured } from "@/lib/stripe.server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }
  return NextResponse.json({ configured: isStripeConfigured() });
}
