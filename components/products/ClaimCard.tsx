"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface ClaimCardProps {
  productId: string;
  productName: string;
  /** Registrable domain that claims instantly (computed server-side), or null */
  claimDomain: string | null;
}

type State = { kind: "idle" } | { kind: "busy" } | { kind: "pending" } | { kind: "error"; message: string };

export function ClaimCard({ productId, productName, claimDomain }: ClaimCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<State>({ kind: "idle" });

  async function claim() {
    setState({ kind: "busy" });
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      });
      if (res.status === 401) {
        router.push(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`);
        return;
      }
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ kind: "error", message: body.error || "申請に失敗しました" });
        return;
      }
      if (body.status === "approved") {
        router.push("/dashboard/products");
        router.refresh();
        return;
      }
      setState({ kind: "pending" });
    } catch {
      setState({ kind: "error", message: "通信エラーが発生しました" });
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-base font-semibold text-gray-900">{productName}の提供企業の方へ</h2>
      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
        このページは編集部が公開情報をもとに作成しました。管理を引き継ぐと、説明文・料金・画像の編集や、問い合わせの受け付けができるようになります。費用はかかりません。
      </p>

      {state.kind === "pending" ? (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          申請を受け付けました。内容を確認のうえ、登録のメールアドレスにご連絡します。
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={claim}
            disabled={state.kind === "busy"}
            className="btn btn-primary w-full mt-4"
          >
            {state.kind === "busy" ? "処理中..." : "このページを管理する（無料）"}
          </button>
          {claimDomain && (
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              <span className="font-medium text-gray-700">@{claimDomain}</span>{" "}
              のメールアドレスでログインすると、すぐに管理を開始できます。それ以外のアドレスの場合は、確認後に承認します。
            </p>
          )}
          {state.kind === "error" && <p className="text-sm text-red-600 mt-3">{state.message}</p>}
        </>
      )}
    </div>
  );
}
