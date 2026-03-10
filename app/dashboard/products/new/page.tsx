import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { canAddProduct, getProductLimit, PLAN_LIMITS } from "@/lib/plans";
import { UpgradeWall } from "@/components/dashboard/UpgradeWall";
import { NewProductForm } from "./NewProductForm";
import type { PlanTier } from "@/types/database";

export default async function NewProductPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data: seller } = await supabase
    .from("sellers")
    .select("id, plan")
    .eq("clerk_user_id", userId)
    .single();

  const plan: PlanTier = (seller?.plan as PlanTier) || "free";
  let productCount = 0;

  if (seller) {
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", seller.id);
    productCount = count || 0;
  }

  if (!canAddProduct(plan, productCount)) {
    return <UpgradeWall currentPlan={plan} limit={PLAN_LIMITS[plan]} />;
  }

  const limit = getProductLimit(plan);
  const remaining = limit !== null ? limit - productCount : null;

  return <NewProductForm remaining={remaining} />;
}
