import type { PricingType } from "@/types/database";

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getPricingLabel(type: PricingType): string {
  const labels: Record<PricingType, string> = {
    free: "無料",
    paid: "有料",
    freemium: "フリーミアム",
    contact: "要問合せ",
  };
  return labels[type];
}

export function getPricingColor(type: PricingType): string {
  const colors: Record<PricingType, string> = {
    free: "bg-emerald-100 text-emerald-700",
    paid: "bg-primary-100 text-primary-700",
    freemium: "bg-violet-100 text-violet-700",
    contact: "bg-gray-100 text-gray-600",
  };
  return colors[type];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
