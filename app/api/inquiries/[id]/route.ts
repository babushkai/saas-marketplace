import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET /api/inquiries/[id] - Get a single inquiry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "データベースが設定されていません" },
        { status: 503 }
      );
    }

    const { id } = params;

    // Get the inquiry with product info
    const { data: inquiry, error } = await supabase
      .from("inquiries")
      .select(`
        *,
        product:products(id, name, slug, seller_id)
      `)
      .eq("id", id)
      .single();

    if (error || !inquiry) {
      return NextResponse.json(
        { error: "お問い合わせが見つかりません" },
        { status: 404 }
      );
    }

    // Verify the user owns this product
    const { data: seller } = await supabase
      .from("sellers")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (!seller || inquiry.product.seller_id !== seller.id) {
      return NextResponse.json(
        { error: "このお問い合わせを閲覧する権限がありません" },
        { status: 403 }
      );
    }

    // Mark as read if not already
    if (!inquiry.is_read) {
      await supabase
        .from("inquiries")
        .update({ is_read: true })
        .eq("id", id);
      inquiry.is_read = true;
    }

    return NextResponse.json({ inquiry });
  } catch (error) {
    console.error("Inquiry API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// DELETE /api/inquiries/[id] - Delete an inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "データベースが設定されていません" },
        { status: 503 }
      );
    }

    const { id } = params;

    // Get the inquiry to check ownership
    const { data: inquiry } = await supabase
      .from("inquiries")
      .select(`
        id,
        product:products(seller_id)
      `)
      .eq("id", id)
      .single();

    if (!inquiry) {
      return NextResponse.json(
        { error: "お問い合わせが見つかりません" },
        { status: 404 }
      );
    }

    // Verify the user owns this product
    const { data: seller } = await supabase
      .from("sellers")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    const productData = inquiry.product as { seller_id: string } | { seller_id: string }[];
    const sellerId = Array.isArray(productData) ? productData[0]?.seller_id : productData?.seller_id;
    
    if (!seller || sellerId !== seller.id) {
      return NextResponse.json(
        { error: "このお問い合わせを削除する権限がありません" },
        { status: 403 }
      );
    }

    // Delete the inquiry
    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "削除に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
