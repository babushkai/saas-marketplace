import type { PlanTier } from "@/types/database";

export const PLAN_LIMITS: Record<PlanTier, number> = {
  free: 3,
  standard: 10,
  pro: Infinity,
};

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: "フリー",
  standard: "スタンダード",
  pro: "プロ",
};

export const PLAN_PRICES: Record<PlanTier, number> = {
  free: 0,
  standard: 980,
  pro: 2980,
};

export function canAddProduct(plan: PlanTier, currentCount: number): boolean {
  return currentCount < PLAN_LIMITS[plan];
}

export function getProductLimit(plan: PlanTier): number | null {
  const limit = PLAN_LIMITS[plan];
  return limit === Infinity ? null : limit;
}
