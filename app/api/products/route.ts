import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

// GET /api/products - Get all products with optional filters
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: "データベースが設定されていません", debug: "supabase_null" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const pricing = searchParams.get("pricing");
    const search = searchParams.get("search");
    const seller_id = searchParams.get("seller_id");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Simple query - no joins
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { 
          error: "プロダクトの取得に失敗しました", 
          details: error.message, 
          code: error.code,
          hint: error.hint 
        },
        { status: 500 }
      );
    }

    // Apply filters in memory if needed (simpler approach)
    let filtered = products || [];
    
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    
    if (pricing) {
      const pricingTypes = pricing.split(",");
      filtered = filtered.filter(p => pricingTypes.includes(p.pricing_type));
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchLower) ||
        p.tagline?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (seller_id) {
      filtered = filtered.filter(p => p.seller_id === seller_id);
    }

    return NextResponse.json({ products: filtered });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      { error: "サーバーエラーが発生しました", details: message, stack },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
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
