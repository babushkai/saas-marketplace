"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PLAN_LABELS, PLAN_PRICES, PLAN_LIMITS } from "@/lib/plans";
import type { PlanTier } from "@/types/database";

// Dynamically import Clerk to avoid build errors when not configured
const ClerkButton = dynamic(
  () =>
    import("@clerk/nextjs").then((mod) => ({
      default: ({ onClick, className, children }: { onClick: () => void; className: string; children: React.ReactNode }) => {
        const { openUserProfile } = mod.useClerk();
        return (
          <button onClick={() => openUserProfile()} className={className}>
            {children}
          </button>
        );
      },
    })),
  {
    ssr: false,
    loading: () => (
      <button className="btn btn-primary opacity-50" disabled>
        読み込み中...
      </button>
    ),
  }
);

const UPGRADE_PLANS: { plan: PlanTier; features: string[] }[] = [
  {
    plan: "standard",
    features: ["10プロダクトまで掲載", "メールサポート", "アナリティクスダッシュボード", "注目プロダクトへの掲載"],
  },
  {
    plan: "pro",
    features: ["無制限のプロダクト掲載", "優先サポート", "高度なアナリティクス", "トップページへの掲載", "カスタムブランディング"],
  },
];

function BillingTab() {
  const [currentPlan, setCurrentPlan] = useState<PlanTier>("free");
  const [hasSubscription, setHasSubscription] = useState(false);
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/sellers/me").then((res) => res.ok ? res.json() : null),
      fetch("/api/stripe/status").then((res) => res.ok ? res.json() : null),
    ])
      .then(([sellerData, stripeData]) => {
        if (sellerData?.seller) {
          setCurrentPlan(sellerData.seller.plan || "free");
          setHasSubscription(!!sellerData.seller.hasSubscription);
        }
        setStripeConfigured(stripeData?.configured === true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (plan: PlanTier) => {
    setActionLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === "stripe_not_configured") {
        setStripeConfigured(false);
      } else if (data.error) {
        alert(data.error);
      }
    } catch {
      alert("エラーが発生しました");
    } finally {
      setActionLoading(null);
    }
  };

  const handleManage = async () => {
    setActionLoading("manage");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("エラーが発生しました");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl animate-pulse">
        <div className="card p-6 mb-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-64 mb-4" />
          <div className="h-10 bg-gray-200 rounded w-24" />
        </div>
      </div>
    );
  }

  const limit = PLAN_LIMITS[currentPlan];
  const availableUpgrades = UPGRADE_PLANS.filter((u) => {
    const tierOrder: Record<PlanTier, number> = { free: 0, standard: 1, pro: 2 };
    return tierOrder[u.plan] > tierOrder[currentPlan];
  });

  return (
    <div className="max-w-2xl">
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">現在のプラン</h3>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
            {PLAN_LABELS[currentPlan]}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-gray-900">
            ¥{PLAN_PRICES[currentPlan].toLocaleString()}
          </span>
          <span className="text-gray-600">/月</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          プロダクト掲載上限: {limit === Infinity ? "無制限" : `${limit}件`}
        </p>
        {hasSubscription && (
          <button
            onClick={handleManage}
            disabled={actionLoading === "manage"}
            className="btn btn-secondary text-sm"
          >
            {actionLoading === "manage" ? "読み込み中..." : "サブスクリプションを管理"}
          </button>
        )}
      </div>

      {!stripeConfigured && availableUpgrades.length > 0 && (
        <div className="card p-4 mb-6 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800">決済システムが未設定です</p>
              <p className="text-sm text-amber-700 mt-1">
                有料プランへのアップグレードには Stripe の設定が必要です。
                管理者が環境変数（STRIPE_SECRET_KEY, STRIPE_PRICE_STANDARD, STRIPE_PRICE_PRO）を設定してください。
              </p>
            </div>
          </div>
        </div>
      )}

      {availableUpgrades.length > 0 && stripeConfigured && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">アップグレード</h3>
          {availableUpgrades.map(({ plan, features }) => (
            <div key={plan} className="card p-6 border-primary-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{PLAN_LABELS[plan]}</h4>
                <span className="text-lg font-bold text-gray-900">
                  ¥{PLAN_PRICES[plan].toLocaleString()}<span className="text-sm font-normal text-gray-500">/月</span>
                </span>
              </div>
              <ul className="space-y-1 mb-4">
                {features.map((f) => (
                  <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan)}
                disabled={actionLoading === plan}
                className="btn btn-primary w-full"
              >
                {actionLoading === plan ? "処理中..." : `${PLAN_LABELS[plan]}にアップグレード`}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "notifications");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("success") === "1") {
      setSuccessMessage("プランのアップグレードが完了しました");
      setActiveTab("billing");
      router.replace("/dashboard/settings?tab=billing");
    }
  }, [searchParams, router]);

  const tabs = [
    { id: "notifications", name: "通知設定" },
    { id: "billing", name: "請求・プラン" },
    { id: "security", name: "セキュリティ" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="text-gray-600 mt-1">
          アカウントの設定や通知の管理ができます
        </p>
        <p className="text-sm text-gray-500 mt-2">
          出品者プロフィールの編集は{" "}
          <Link href="/dashboard/profile" className="text-primary-600 hover:underline">
            プロフィールページ
          </Link>
          {" "}から行えます
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="max-w-2xl">
          <div className="card p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-gray-900">通知設定は準備中です</h3>
                <p className="text-sm text-gray-500 mt-1">
                  メール通知やブラウザ通知の設定機能は近日公開予定です。
                  お問い合わせの受信状況はダッシュボードからご確認いただけます。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <BillingTab />
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="max-w-2xl space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              アカウントセキュリティ
            </h3>
            <p className="text-gray-600 mb-4">
              パスワードの変更、二要素認証の設定、その他のセキュリティ設定はClerkアカウント管理から行えます。
            </p>
            <ClerkButton onClick={() => {}} className="btn btn-primary">
              アカウント設定を開く
            </ClerkButton>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              セキュリティのヒント
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>強力なパスワードを使用してください（12文字以上推奨）</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>二要素認証を有効にしてアカウントを保護しましょう</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>他のサービスと同じパスワードを使い回さないでください</span>
              </li>
            </ul>
          </div>

          <div className="card p-6 border-red-200">
            <h3 className="text-lg font-medium text-red-600 mb-4">
              アカウントの削除
            </h3>
            <p className="text-gray-600 mb-4">
              アカウントを削除すると、すべてのデータが完全に削除されます。
              この操作は取り消せません。
            </p>
            <ClerkButton onClick={() => {}} className="btn bg-red-600 text-white hover:bg-red-700">
              アカウント管理へ
            </ClerkButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-32 mb-4" /><div className="h-4 bg-gray-200 rounded w-64" /></div>}>
      <SettingsContent />
    </Suspense>
  );
}
