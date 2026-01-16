import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET /api/sellers - Get seller by username or current user's seller profile
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "データベースが設定されていません" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const current = searchParams.get("current");

    if (current === "true") {
      // Get current user's seller profile
      const { userId } = await auth();

      if (!userId) {
        return NextResponse.json(
          { error: "認証が必要です" },
          { status: 401 }
        );
      }

      let { data: seller, error } = await supabase
        .from("sellers")
        .select("*")
        .eq("clerk_user_id", userId)
        .single();

      // Auto-create seller profile if it doesn't exist
      if (error || !seller) {
        const { data: newSeller, error: createError } = await supabase
          .from("sellers")
          .insert({
            clerk_user_id: userId,
            username: `user-${userId.slice(-8).toLowerCase()}`,
            display_name: "新規出品者",
          })
          .select()
          .single();

        if (createError || !newSeller) {
          console.error("Failed to create seller:", createError);
          return NextResponse.json(
            { error: "出品者プロフィールの作成に失敗しました" },
            { status: 500 }
          );
        }
        seller = newSeller;
      }

      return NextResponse.json({ seller });
    }

    if (username) {
      // Get seller by username with their products
      const { data: seller, error } = await supabase
        .from("sellers")
        .select(`
          *,
          products:products(*)
        `)
        .eq("username", username)
        .single();

      if (error || !seller) {
        return NextResponse.json(
          { error: "出品者が見つかりません" },
          { status: 404 }
        );
      }

      // Filter to only published products
      seller.products = seller.products.filter((p: any) => p.is_published);

      return NextResponse.json({ seller });
    }

    return NextResponse.json(
      { error: "username または current パラメータが必要です" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Sellers API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// PUT /api/sellers - Update current user's seller profile
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const {
      username,
      display_name,
      company_name,
      bio,
      avatar_url,
      website_url,
      twitter_url,
    } = body;

    // Validate username format
    if (username && !/^[a-z0-9-]+$/.test(username)) {
      return NextResponse.json(
        { error: "ユーザー名は小文字英数字とハイフンのみ使用可能です" },
        { status: 400 }
      );
    }

    // Check if username is taken by another user
    if (username) {
      const { data: existingSeller } = await supabase
        .from("sellers")
        .select("id, clerk_user_id")
        .eq("username", username)
        .single();

      if (existingSeller && existingSeller.clerk_user_id !== userId) {
        return NextResponse.json(
          { error: "このユーザー名は既に使用されています" },
          { status: 400 }
        );
      }
    }

    // Check if seller exists
    const { data: existingProfile } = await supabase
      .from("sellers")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    let seller;
    let error;

    if (existingProfile) {
      // Update existing seller profile
      const result = await supabase
        .from("sellers")
        .update({
          username,
          display_name,
          company_name: company_name || null,
          bio: bio || null,
          avatar_url: avatar_url || null,
          website_url: website_url || null,
          twitter_url: twitter_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", userId)
        .select()
        .single();
      
      seller = result.data;
      error = result.error;
    } else {
      // Create new seller profile
      const result = await supabase
        .from("sellers")
        .insert({
          clerk_user_id: userId,
          username,
          display_name,
          company_name: company_name || null,
          bio: bio || null,
          avatar_url: avatar_url || null,
          website_url: website_url || null,
          twitter_url: twitter_url || null,
        })
        .select()
        .single();
      
      seller = result.data;
      error = result.error;
    }

    if (error) {
      console.error("Failed to save seller:", error);
      return NextResponse.json(
        { error: "プロフィールの保存に失敗しました", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, seller });
  } catch (error) {
    console.error("Sellers API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
