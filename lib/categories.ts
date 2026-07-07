export interface UICategory {
  id: string;
  name: string;
}

/**
 * All product categories used across the site.
 * IDs must match the `category` column values in the `products` table.
 */
export const PRODUCT_CATEGORIES: UICategory[] = [
  { id: "marketing", name: "マーケティング" },
  { id: "sales", name: "営業・CRM" },
  { id: "finance", name: "経理・財務" },
  { id: "hr", name: "人事・労務" },
  { id: "productivity", name: "業務効率化" },
  { id: "communication", name: "コミュニケーション" },
  { id: "development", name: "開発・エンジニアリング" },
  { id: "design", name: "デザイン" },
  { id: "other", name: "その他" },
];

/** Categories with "all" option — used in filter UI */
export const FILTER_CATEGORIES: UICategory[] = [
  { id: "all", name: "すべて" },
  ...PRODUCT_CATEGORIES,
];

/** Category color system — full class strings to survive Tailwind purge */
interface CategoryColor {
  bg: string;
  text: string;
  gradient: string;
}

const CATEGORY_COLOR_MAP: Record<string, CategoryColor> = {
  marketing: { bg: "bg-orange-50", text: "text-orange-700", gradient: "bg-gradient-to-br from-orange-100 to-amber-50" },
  sales: { bg: "bg-blue-50", text: "text-blue-700", gradient: "bg-gradient-to-br from-blue-100 to-sky-50" },
  finance: { bg: "bg-emerald-50", text: "text-emerald-700", gradient: "bg-gradient-to-br from-emerald-100 to-teal-50" },
  hr: { bg: "bg-purple-50", text: "text-purple-700", gradient: "bg-gradient-to-br from-purple-100 to-violet-50" },
  productivity: { bg: "bg-amber-50", text: "text-amber-700", gradient: "bg-gradient-to-br from-amber-100 to-yellow-50" },
  communication: { bg: "bg-cyan-50", text: "text-cyan-700", gradient: "bg-gradient-to-br from-cyan-100 to-sky-50" },
  development: { bg: "bg-indigo-50", text: "text-indigo-700", gradient: "bg-gradient-to-br from-indigo-100 to-blue-50" },
  design: { bg: "bg-pink-50", text: "text-pink-700", gradient: "bg-gradient-to-br from-pink-100 to-rose-50" },
  other: { bg: "bg-gray-50", text: "text-gray-700", gradient: "bg-gradient-to-br from-gray-100 to-slate-50" },
};

const DEFAULT_COLOR: CategoryColor = { bg: "bg-gray-50", text: "text-gray-700", gradient: "bg-gradient-to-br from-gray-100 to-slate-50" };

export function getCategoryColor(id: string): CategoryColor {
  return CATEGORY_COLOR_MAP[id] ?? DEFAULT_COLOR;
}

/** Homepage featured categories (explicitly curated subset) */
const HOMEPAGE_IDS = ["marketing", "sales", "finance", "hr", "productivity", "communication"];
export const HOMEPAGE_CATEGORIES: UICategory[] = PRODUCT_CATEGORIES.filter(c => HOMEPAGE_IDS.includes(c.id));
