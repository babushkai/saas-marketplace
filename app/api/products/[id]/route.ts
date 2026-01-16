import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "データベースが設定されていません" },
        { status: 503 }
      );
    }

    const { id } = params;

    // Check if id is a slug or UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let query = supabase
      .from("products")
      .select(`
        *,
        seller:sellers(id, username, display_name, company_name, bio, avatar_url, website_url, twitter_url)
      `)
      .eq("is_published", true);

    if (isUUID) {
      query = query.eq("id", id);
    } else {
      query = query.eq("slug", id);
    }

    const { data: product, error } = await query.single();

    if (error || !product) {
      return NextResponse.json(
        { error: "プロダクトが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
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
    const body = await request.json();

    // Get seller by clerk_user_id
    const { data: seller } = await supabase
      .from("sellers")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (!seller) {
      return NextResponse.json(
        { error: "出品者情報が見つかりません" },
        { status: 404 }
      );
    }

    // Check if product belongs to this seller
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, seller_id")
      .eq("id", id)
      .single();

    if (!existingProduct) {
      return NextResponse.json(
        { error: "プロダクトが見つかりません" },
        { status: 404 }
      );
    }

    if (existingProduct.seller_id !== seller.id) {
      return NextResponse.json(
        { error: "このプロダクトを編集する権限がありません" },
        { status: 403 }
      );
    }

    // Update product
    const {
      name,
      tagline,
      description,
      category,
      pricing_type,
      price_info,
      website_url,
      is_published,
      logo_url,
      screenshots,
    } = body;

    const { data: product, error } = await supabase
      .from("products")
      .update({
        name,
        tagline,
        description,
        category,
        pricing_type,
        price_info: price_info || null,
        website_url: website_url || null,
        is_published: is_published ?? false,
        logo_url: logo_url || null,
        screenshots: screenshots || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update product:", error);
      return NextResponse.json(
        { error: "プロダクトの更新に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Product API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
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

    // Get seller by clerk_user_id
    const { data: seller } = await supabase
      .from("sellers")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (!seller) {
      return NextResponse.json(
        { error: "出品者情報が見つかりません" },
        { status: 404 }
      );
    }

    // Check if product belongs to this seller
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, seller_id")
      .eq("id", id)
      .single();

    if (!existingProduct) {
      return NextResponse.json(
        { error: "プロダクトが見つかりません" },
        { status: 404 }
      );
    }

    if (existingProduct.seller_id !== seller.id) {
      return NextResponse.json(
        { error: "このプロダクトを削除する権限がありません" },
        { status: 403 }
      );
    }

    // Delete product
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete product:", error);
      return NextResponse.json(
        { error: "プロダクトの削除に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
