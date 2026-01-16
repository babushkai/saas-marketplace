import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, sender_name, sender_email, sender_company, message } = body;

    // Validate required fields
    if (!product_id || !sender_name || !sender_email || !message) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sender_email)) {
      return NextResponse.json(
        { error: "メールアドレスの形式が正しくありません" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: "データベースが設定されていません" },
        { status: 503 }
      );
    }

    // Verify product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, seller_id")
      .eq("id", product_id)
      .eq("is_published", true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "プロダクトが見つかりません" },
        { status: 404 }
      );
    }

    // Create inquiry
    const { data: inquiry, error: inquiryError } = await supabase
      .from("inquiries")
      .insert({
        product_id,
        sender_name,
        sender_email,
        sender_company: sender_company || null,
        message,
        is_read: false,
      })
      .select()
      .single();

    if (inquiryError) {
      console.error("Failed to create inquiry:", inquiryError);
      return NextResponse.json(
        { error: "お問い合わせの送信に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("Inquiry API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
