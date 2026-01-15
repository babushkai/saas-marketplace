import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      tagline,
      description,
      category,
      pricing_type,
      price_info,
      website_url,
      is_published,
    } = body;

    // Validate required fields
    if (!name || !tagline || !description || !category || !pricing_type) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
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

    // Get or create seller profile
    let { data: seller } = await supabase
      .from("sellers")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (!seller) {
      // Create seller profile
      const { data: newSeller, error: sellerError } = await supabase
        .from("sellers")
        .insert({
          clerk_user_id: userId,
          username: `user-${userId.slice(-8)}`,
          display_name: "新規出品者",
        })
        .select()
        .single();

      if (sellerError || !newSeller) {
        console.error("Failed to create seller:", sellerError);
        return NextResponse.json(
          { error: "出品者プロフィールの作成に失敗しました" },
          { status: 500 }
        );
      }
      seller = newSeller;
    }

    // Generate unique slug
    let slug = slugify(name);
    const { data: existingProduct } = await supabase
      .from("products")
      .select("slug")
      .eq("slug", slug)
      .single();

    if (existingProduct) {
      slug = `${slug}-${Date.now()}`;
    }

    // TypeScript guard - seller is guaranteed to be non-null at this point
    if (!seller) {
      return NextResponse.json(
        { error: "出品者情報の取得に失敗しました" },
        { status: 500 }
      );
    }

    // Create product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        seller_id: seller.id,
        slug,
        name,
        tagline,
        description,
        category,
        pricing_type,
        price_info: price_info || null,
        website_url: website_url || null,
        is_published: is_published ?? false,
        screenshots: [],
        logo_url: null,
      })
      .select()
      .single();

    if (productError) {
      console.error("Failed to create product:", productError);
      return NextResponse.json(
        { error: "プロダクトの作成に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
