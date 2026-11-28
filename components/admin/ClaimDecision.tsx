"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ClaimDecision({ claimId }: { claimId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(action: "approve" | "reject") {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch(`/api/admin/claims/${claimId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) setError(body.error || "処理に失敗しました");
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => decide("approve")}
          disabled={busy !== null}
          className="btn btn-primary btn-sm"
        >
          {busy === "approve" ? "処理中..." : "承認"}
        </button>
        <button
          type="button"
          onClick={() => decide("reject")}
          disabled={busy !== null}
          className="btn btn-outline btn-sm"
        >
          {busy === "reject" ? "処理中..." : "却下"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
