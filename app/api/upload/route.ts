import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// POST /api/upload - Upload an image to Supabase Storage
export async function POST(request: NextRequest) {
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
        { error: "ストレージが設定されていません" },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'avatar' | 'logo' | 'screenshot'

    if (!file) {
      return NextResponse.json(
        { error: "ファイルが選択されていません" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "JPG, PNG, GIF, WebP形式のみアップロード可能です" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "ファイルサイズは5MB以下にしてください" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const folder = type === "avatar" ? "avatars" : type === "logo" ? "logos" : "screenshots";
    const filename = `${folder}/${userId}/${timestamp}-${randomStr}.${ext}`;

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("images")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: "アップロードに失敗しました", details: error.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete an image from Supabase Storage
export async function DELETE(request: NextRequest) {
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
        { error: "ストレージが設定されていません" },
        { status: 503 }
      );
    }

    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { error: "パスが指定されていません" },
        { status: 400 }
      );
    }

    // Security check: only allow deleting own files
    if (!path.includes(`/${userId}/`)) {
      return NextResponse.json(
        { error: "このファイルを削除する権限がありません" },
        { status: 403 }
      );
    }

    const { error } = await supabase.storage
      .from("images")
      .remove([path]);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: "削除に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
