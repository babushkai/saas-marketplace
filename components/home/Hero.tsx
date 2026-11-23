import Link from "next/link";
import { HeroSearch } from "@/components/home/HeroSearch";
import type { ProductWithStats } from "@/types/database";

interface HeroProps {
  totalProducts: number;
  categoryCount: number;
  featuredProducts?: ProductWithStats[];
}

export function Hero({ totalProducts, categoryCount }: HeroProps) {
  const stats = [
    { value: `${totalProducts}件`, label: "掲載プロダクト" },
    { value: `${categoryCount}`, label: "カテゴリー" },
    { value: "0円", label: "掲載料（フリープラン）" },
    { value: "審査なし", label: "登録後すぐに公開" },
  ];

  return (
    <section className="bg-primary-700 text-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            日本のSaaS・サービスを
            <br />
            見つけよう
          </h1>
          <p className="text-base md:text-lg text-primary-100 mb-8 max-w-2xl">
            国内発のSaaS製品・ツールを、カテゴリーや料金で比較できるマーケットプレイスです。
            気になるサービスには、そのまま問い合わせができます。
          </p>
          <HeroSearch />
          <p className="mt-4 text-sm text-primary-100">
            SaaSを提供している方は{" "}
            <Link href="/sign-up" className="text-white font-medium underline underline-offset-2 hover:text-primary-100">
              無料で出品できます →
            </Link>
          </p>
        </div>

        <dl className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/15 rounded-lg overflow-hidden max-w-4xl">
          {stats.map((s) => (
            <div key={s.label} className="bg-primary-700 px-4 py-3 flex flex-col-reverse">
              <dt className="text-xs text-primary-200">{s.label}</dt>
              <dd className="text-xl md:text-2xl font-bold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
