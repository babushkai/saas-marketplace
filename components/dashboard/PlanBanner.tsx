import Link from "next/link";
import type { PlanTier } from "@/types/database";
import { PLAN_LABELS, PLAN_LIMITS } from "@/lib/plans";

interface PlanBannerProps {
  plan: PlanTier;
  productCount: number;
}

export function PlanBanner({ plan, productCount }: PlanBannerProps) {
  const limit = PLAN_LIMITS[plan];
  if (limit === Infinity) return null;

  const usage = productCount / limit;
  const isAtLimit = productCount >= limit;
  const isNearLimit = usage >= 0.8;

  return (
    <div
      className={`rounded-lg border p-4 mb-6 ${
        isAtLimit
          ? "bg-red-50 border-red-200"
          : isNearLimit
            ? "bg-amber-50 border-amber-200"
            : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {PLAN_LABELS[plan]}プラン
          </span>
          <span className="text-xs text-gray-500">
            {productCount} / {limit} プロダクト
          </span>
        </div>
        {(isAtLimit || isNearLimit) && (
          <Link
            href="/pricing"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            アップグレード →
          </Link>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            isAtLimit
              ? "bg-red-500"
              : isNearLimit
                ? "bg-amber-500"
                : "bg-primary-500"
          }`}
          style={{ width: `${Math.min(usage * 100, 100)}%` }}
        />
      </div>
      {isAtLimit && (
        <p className="text-sm text-red-600 mt-2">
          プロダクト数の上限に達しました。新しいプロダクトを追加するにはプランをアップグレードしてください。
        </p>
      )}
    </div>
  );
}
