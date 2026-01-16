import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Inquiry, Product } from "@/types/database";

async function getInquiries(): Promise<(Inquiry & { product: Product })[]> {
  const { userId } = await auth();
  
  if (!userId) {
    return [];
  }

  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return [];
  }

  // Get seller ID for current user
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!seller) {
    return [];
  }

  // Get seller's products first
  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("seller_id", seller.id);
  
  if (!products || products.length === 0) {
    return [];
  }

  const productIds = products.map(p => p.id);

  // Get inquiries for seller's products
  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      product:products(*)
    `)
    .in("product_id", productIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch inquiries:", error);
    return [];
  }

  return (inquiries || []) as (Inquiry & { product: Product })[];
}

export default async function InquiriesPage() {
  const inquiries = await getInquiries();
  const unreadCount = inquiries.filter((i) => !i.is_read).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">お問い合わせ</h1>
        <p className="text-gray-600 mt-1">
          プロダクトへのお問い合わせを確認できます
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {unreadCount}件の未読
            </span>
          )}
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            お問い合わせはまだありません
          </h3>
          <p className="text-gray-500">
            プロダクトを公開すると、興味を持った企業からお問い合わせが届きます
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`card p-6 ${!inquiry.is_read ? "border-l-4 border-l-primary-500" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {!inquiry.is_read && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        未読
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {inquiry.product.name}
                    </span>
                  </div>

                  <h3 className="font-medium text-gray-900">
                    {inquiry.sender_name}
                    {inquiry.sender_company && (
                      <span className="text-gray-500 font-normal ml-2">
                        ({inquiry.sender_company})
                      </span>
                    )}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {inquiry.message}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <a
                      href={`mailto:${inquiry.sender_email}`}
                      className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      返信する
                    </a>
                    <span className="text-sm text-gray-400">
                      {inquiry.sender_email}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-500 flex-shrink-0">
                  {formatDate(inquiry.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
