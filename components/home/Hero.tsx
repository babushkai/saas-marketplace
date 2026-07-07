import Link from "next/link";
import Image from "next/image";
import { HeroSearch } from "@/components/home/HeroSearch";
import type { ProductWithStats } from "@/types/database";

interface HeroProps {
  totalProducts: number;
  featuredProducts?: ProductWithStats[];
}

export function Hero({ totalProducts, featuredProducts = [] }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white py-16 md:py-24 relative overflow-hidden shadow-hero-glow">
      <div className="bg-grid-white absolute inset-0" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400 rounded-full blur-3xl opacity-30" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {totalProducts}+ のプロダクトが掲載中
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-brand-tight mb-4 leading-tight animate-fade-up"
            style={{ animationDelay: "60ms" }}
          >
            日本のSaaS・サービスを
            <br />
            見つけよう
          </h1>
          <p
            className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl animate-fade-up"
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

          {featuredProducts.length > 0 && (
            <div
              className="mt-10 flex items-center gap-4 animate-fade-up"
              style={{ animationDelay: "280ms" }}
            >
              <span className="text-xs text-primary-200 shrink-0">導入企業のプロダクト例</span>
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
