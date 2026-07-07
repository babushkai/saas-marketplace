interface TrustBannerProps {
  totalProducts: number;
  categoryCount: number;
}

interface TrustItem {
  icon: string;
  label: string;
  getValue: (props: TrustBannerProps) => string;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    label: "掲載プロダクト",
    getValue: ({ totalProducts }) => `${totalProducts}+`,
  },
  {
    icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    label: "カテゴリー",
    getValue: ({ categoryCount }) => `${categoryCount}`,
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    label: "無料プランあり",
    getValue: () => "0円〜",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    label: "審査なし・即時公開",
    getValue: () => "即日",
  },
];

export function TrustBanner({ totalProducts, categoryCount }: TrustBannerProps) {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {TRUST_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-5 px-4 md:justify-center transition-colors hover:bg-primary-50/40"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 tracking-brand-tight">
                  {item.getValue({ totalProducts, categoryCount })}
                </p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
