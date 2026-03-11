"use client";

import { useEffect } from "react";

export function ViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    const key = `viewed_${productId}`;
    if (sessionStorage.getItem(key)) return;

    const sessionId =
      sessionStorage.getItem("vsid") ||
      (() => {
        const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
        sessionStorage.setItem("vsid", id);
        return id;
      })();

    // Set flag before firing to prevent double-fire in strict mode
    sessionStorage.setItem(key, "1");

    const body = JSON.stringify({ productId, sessionId });
    const blob = new Blob([body], { type: "application/json" });
    const sent = navigator.sendBeacon("/api/views", blob);

    if (!sent) {
      fetch("/api/views", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  }, [productId]);

  return null;
}
