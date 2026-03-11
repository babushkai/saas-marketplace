import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { DashboardSidebar, DashboardMobileNav } from "@/components/dashboard/DashboardNav";
import { cache } from "react";

// React cache() deduplicates across layout + page in the same request
const getUnreadCount = cache(async (): Promise<number> => {
  const { userId } = await auth();
  if (!userId) return 0;

  const supabase = createServerSupabaseClient();
  if (!supabase) return 0;

  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!seller) return 0;

  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("seller_id", seller.id);

  const productIds = (products || []).map((p) => p.id);
  if (productIds.length === 0) return 0;

  const { count } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .in("product_id", productIds)
    .eq("is_read", false);

  return count ?? 0;
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unreadInquiries = await getUnreadCount();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar — desktop only */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <DashboardSidebar unreadInquiries={unreadInquiries} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-20 md:pb-6 bg-gray-50">{children}</main>

      {/* Bottom nav — mobile only */}
      <DashboardMobileNav unreadInquiries={unreadInquiries} />
    </div>
  );
}
