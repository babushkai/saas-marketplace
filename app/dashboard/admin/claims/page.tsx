import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { isAdmin, registrableDomain } from "@/lib/claims";
import { formatDate } from "@/lib/utils";
import { ClaimDecision } from "@/components/admin/ClaimDecision";

export const dynamic = "force-dynamic";
export const metadata = { title: "掲載ページの管理申請", robots: { index: false } };

interface ClaimRow {
  id: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  method: "domain_match" | "manual" | null;
  note: string | null;
  created_at: string;
  decided_at: string | null;
  product: { name: string; slug: string; website_url: string | null } | null;
}

const STATUS_LABEL: Record<ClaimRow["status"], string> = {
  pending: "未処理",
  approved: "承認済み",
  rejected: "却下",
};

const STATUS_STYLE: Record<ClaimRow["status"], string> = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-gray",
};

export default async function AdminClaimsPage() {
  const { userId } = await auth();
  if (!isAdmin(userId)) notFound();

  const supabase = createServerSupabaseClient();
  const select = "id, email, status, method, note, created_at, decided_at, product:products(name, slug, website_url)";

  const [{ data: pending }, { data: recent }] = supabase
    ? await Promise.all([
        supabase.from("claim_requests").select(select).eq("status", "pending").order("created_at", { ascending: true }),
        supabase.from("claim_requests").select(select).neq("status", "pending").order("decided_at", { ascending: false }).limit(20),
      ])
    : [{ data: [] }, { data: [] }];

  const pendingRows = (pending ?? []) as unknown as ClaimRow[];
  const recentRows = (recent ?? []) as unknown as ClaimRow[];

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">掲載ページの管理申請</h1>
        <p className="text-sm text-gray-500 mt-1">
          メールアドレスのドメインが公式サイトと一致しない申請です。申請者が提供企業の関係者か確認してから承認してください。
        </p>
      </div>

      <section className="card overflow-hidden">
        <h2 className="px-5 py-3 border-b border-gray-100 font-semibold text-gray-900">
          未処理 <span className="text-gray-400 font-normal">{pendingRows.length}件</span>
        </h2>
        {pendingRows.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-500 text-center">未処理の申請はありません</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {pendingRows.map((c) => (
              <li key={c.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div className="min-w-0 text-sm">
                  <p className="font-medium text-gray-900">
                    {c.product ? (
                      <Link href={`/products/${c.product.slug}`} className="hover:text-primary-600" target="_blank">
                        {c.product.name}
                      </Link>
                    ) : (
                      "（削除されたプロダクト）"
                    )}
                  </p>
                  <p className="text-gray-600 mt-0.5">
                    申請者: {c.email}
                    <span className="text-gray-400">
                      {" "}／ 公式サイト: {c.product?.website_url ? registrableDomain(c.product.website_url) : "未登録"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(c.created_at)} 申請</p>
                </div>
                <ClaimDecision claimId={c.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card overflow-hidden">
        <h2 className="px-5 py-3 border-b border-gray-100 font-semibold text-gray-900">最近の処理</h2>
        {recentRows.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-500 text-center">まだありません</p>
        ) : (
          <ul className="divide-y divide-gray-100 text-sm">
            {recentRows.map((c) => (
              <li key={c.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-medium text-gray-900">{c.product?.name ?? "（削除されたプロダクト）"}</span>
                  <span className="text-gray-500"> — {c.email}</span>
                  {c.note && <span className="text-gray-400">（{c.note}）</span>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {c.method === "domain_match" && <span className="text-xs text-gray-400">ドメイン一致で自動承認</span>}
                  <span className={`badge ${STATUS_STYLE[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
