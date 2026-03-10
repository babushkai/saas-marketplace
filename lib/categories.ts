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

/** Homepage featured categories (explicitly curated subset) */
const HOMEPAGE_IDS = ["marketing", "sales", "finance", "hr", "productivity", "communication"];
export const HOMEPAGE_CATEGORIES: UICategory[] = PRODUCT_CATEGORIES.filter(c => HOMEPAGE_IDS.includes(c.id));
