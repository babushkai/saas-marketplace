import Link from "next/link";
import Image from "next/image";
import { HeroSearch } from "@/components/home/HeroSearch";
import type { ProductWithStats } from "@/types/database";

interface HeroProps {
  totalProducts: number;
  categoryCount: number;
  featuredProducts?: ProductWithStats[];
}

export function Hero({ totalProducts, categoryCount, featuredProducts = [] }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-primary-800 via-primary-600 to-fuchsia-700 text-white py-20 md:py-32 relative overflow-hidden shadow-hero-glow">
      <div className="bg-grid-white absolute inset-0" />
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] bg-fuchsia-400 rounded-full blur-[100px] opacity-30" />
        <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] bg-cyan-300 rounded-full blur-[100px] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-400 rounded-full blur-[120px] opacity-25" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl">
          <div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-8 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            日本最大級のSaaSマーケットプレイス
          </div>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-brand-tight mb-6 leading-[1.05] animate-fade-up"
            style={{ animationDelay: "60ms" }}
          >
            日本のSaaS・サービスを
            <br />
            <span className="bg-gradient-to-r from-white via-fuchsia-100 to-cyan-100 bg-clip-text text-transparent">
              見つけよう
            </span>
          </h1>
          <p
            className="text-xl md:text-2xl text-primary-100 mb-10 max-w-2xl leading-relaxed animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            国内発のSaaS製品・オープンソースツールを探せるマーケットプレイス。
            あなたのビジネスに最適なツールがきっと見つかります。
          </p>
          <div className="animate-fade-up" style={{ animationDelay: "180ms" }}>
            <HeroSearch />
          </div>
          <p className="mt-4 text-sm text-primary-200 animate-fade-up" style={{ animationDelay: "220ms" }}>
            出品者ですか？{" "}
            <Link href="/sign-up" className="text-white underline underline-offset-2 hover:text-primary-100">
              無料で出品を始める →
            </Link>
          </p>

          <div
            className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-5 animate-fade-up"
            style={{ animationDelay: "260ms" }}
          >
            <div>
              <p className="text-3xl md:text-4xl font-extrabold tracking-brand-tight">{totalProducts}+</p>
              <p className="text-xs text-primary-200 mt-0.5">掲載プロダクト</p>
            </div>
            <div className="w-px h-10 bg-white/20 hidden sm:block" />
            <div>
              <p className="text-3xl md:text-4xl font-extrabold tracking-brand-tight">{categoryCount}</p>
              <p className="text-xs text-primary-200 mt-0.5">カテゴリー</p>
            </div>
            <div className="w-px h-10 bg-white/20 hidden sm:block" />
            <div>
              <p className="text-3xl md:text-4xl font-extrabold tracking-brand-tight">0円〜</p>
              <p className="text-xs text-primary-200 mt-0.5">無料プランあり</p>
            </div>
            <div className="w-px h-10 bg-white/20 hidden sm:block" />
            <div>
              <p className="text-3xl md:text-4xl font-extrabold tracking-brand-tight">即日</p>
              <p className="text-xs text-primary-200 mt-0.5">審査なし・即時公開</p>
            </div>

            {featuredProducts.length > 0 && (
              <>
                <div className="w-px h-10 bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {featuredProducts.map((product) => (
                      <div
                        key={product.id}
                        title={product.name}
                        className="relative w-9 h-9 rounded-full bg-white ring-2 ring-primary-600 overflow-hidden flex items-center justify-center"
                      >
                        {product.logo_url ? (
                          <Image
                            src={product.logo_url}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                            unoptimized
                          />
                        ) : (
                          <span className="text-xs font-bold text-primary-600">
                            {product.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-primary-200">導入企業の例</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
