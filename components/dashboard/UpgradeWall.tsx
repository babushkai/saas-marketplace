import Link from "next/link";
import type { PlanTier } from "@/types/database";
import { PLAN_LABELS } from "@/lib/plans";

interface UpgradeWallProps {
  currentPlan: PlanTier;
  limit: number;
}

export function UpgradeWall({ currentPlan, limit }: UpgradeWallProps) {
  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        プロダクト数の上限に達しました
      </h2>
      <p className="text-gray-600 mb-6">
        {PLAN_LABELS[currentPlan]}プランでは最大{limit}個のプロダクトまで登録できます。
        より多くのプロダクトを掲載するにはプランをアップグレードしてください。
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/pricing" className="btn btn-primary">
          プランを確認する
        </Link>
        <Link href="/dashboard/products" className="btn btn-secondary">
          プロダクト一覧に戻る
        </Link>
      </div>
    </div>
  );
}
