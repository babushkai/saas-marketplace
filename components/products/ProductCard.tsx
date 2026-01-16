import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/database";
import { getPricingLabel, getPricingColor } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="card card-hover p-5 h-full">
        <div className="flex items-start gap-4">
          <div className="relative w-14 h-14 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden">
            {product.logo_url ? (
              <Image
                src={product.logo_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-semibold text-slate-300">
                {product.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 group-hover:text-slate-600 transition-colors truncate">
              {product.name}
            </h3>
            <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
              {product.tagline}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${getPricingColor(product.pricing_type)}`}
              >
                {getPricingLabel(product.pricing_type)}
              </span>
              {product.price_info && (
                <span className="text-xs text-slate-400">
                  {product.price_info}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
