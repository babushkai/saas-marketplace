import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { DashboardSidebar, DashboardMobileNav } from "@/components/dashboard/DashboardNav";
import { cache } from "react";

interface LayoutData {
  unreadInquiries: number;
  sellerName: string;
  avatarUrl: string | null;
}

const getLayoutData = cache(async (): Promise<LayoutData> => {
  const empty: LayoutData = { unreadInquiries: 0, sellerName: "", avatarUrl: null };
  const { userId } = await auth();
  if (!userId) return empty;

  const supabase = createServerSupabaseClient();
  if (!supabase) return empty;

  const { data: seller } = await supabase
    .from("sellers")
    .select("id, display_name, avatar_url")
    .eq("clerk_user_id", userId)
    .single();

  if (!seller) return empty;

  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("seller_id", seller.id);

  const productIds = (products || []).map((p) => p.id);
  if (productIds.length === 0) {
    return { unreadInquiries: 0, sellerName: seller.display_name, avatarUrl: seller.avatar_url };
  }

  const { count } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .in("product_id", productIds)
    .eq("is_read", false);

  return {
    unreadInquiries: count ?? 0,
    sellerName: seller.display_name,
    avatarUrl: seller.avatar_url,
  };
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { unreadInquiries, sellerName, avatarUrl } = await getLayoutData();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:block">
        <DashboardSidebar
          unreadInquiries={unreadInquiries}
          sellerName={sellerName}
          avatarUrl={avatarUrl}
        />
      </aside>
      <main className="flex-1 p-6 pb-20 md:pb-6 bg-gray-50">{children}</main>
      <DashboardMobileNav unreadInquiries={unreadInquiries} />
    </div>
  );
}
