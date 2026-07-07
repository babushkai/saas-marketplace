"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

export function PublishToggle({ productId, isPublished }: { productId: string; isPublished: boolean }) {
  const [optimistic, setOptimistic] = useState(isPublished);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleToggle = async () => {
    const newValue = !optimistic;
    setOptimistic(newValue);
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: newValue }),
      });
      if (!res.ok) throw new Error();
      showToast(newValue ? "公開しました" : "非公開にしました", "success");
      router.refresh();
    } catch {
      setOptimistic(!newValue);
      showToast("更新に失敗しました", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
        optimistic ? "bg-green-500" : "bg-gray-300"
      } ${loading ? "opacity-50" : ""}`}
      title={optimistic ? "非公開にする" : "公開する"}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
          optimistic ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
