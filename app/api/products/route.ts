import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import { canAddProduct, getProductLimit } from "@/lib/plans";
import type { PlanTier } from "@/types/database";

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
    const limitRaw = parseInt(searchParams.get("limit") || "50");
    const offsetRaw = parseInt(searchParams.get("offset") || "0");
    const limit = isNaN(limitRaw) || limitRaw < 1 ? 50 : Math.min(limitRaw, 100);
    const offset = isNaN(offsetRaw) || offsetRaw < 0 ? 0 : offsetRaw;

    // Build query with server-side filters
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("is_published", true);

    if (category) {
      query = query.eq("category", category);
    }

    if (pricing) {
      const pricingTypes = pricing.split(",");
      query = query.in("pricing_type", pricingTypes);
    }

    if (search) {
      const sanitized = search.slice(0, 100).replace(/[%_\\.,]/g, "");
      if (sanitized) {
        query = query.or(`name.ilike.%${sanitized}%,tagline.ilike.%${sanitized}%`);
      }
    }

    if (seller_id) {
      query = query.eq("seller_id", seller_id);
    }

    const { data: products, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: "プロダクトの取得に失敗しました", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ products: products || [], total: count ?? 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Products API error:", message);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
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
      logo_url,
      screenshots,
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
      .select("id, plan")
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

    // Plan limit enforcement
    const plan = (seller.plan || "free") as PlanTier;
    const { count: productCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", seller.id);

    if (!canAddProduct(plan, productCount || 0)) {
      return NextResponse.json(
        {
          error: "プラン上限に達しています。アップグレードしてください。",
          code: "PLAN_LIMIT_EXCEEDED",
          limit: getProductLimit(plan),
        },
        { status: 403 }
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
        screenshots: screenshots || [],
        logo_url: logo_url || null,
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
