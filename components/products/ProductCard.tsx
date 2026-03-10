import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/database";
import { getPricingLabel, getPricingColor } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

function isNew(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  if (isNaN(created)) return false;
  return Date.now() - created < 14 * 24 * 60 * 60 * 1000;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  if (compact) {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:shadow-sm transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            {product.logo_url ? (
              <Image
                src={product.logo_url}
                alt={product.name}
                fill
                className="object-contain p-0.5"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">
                {product.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 group-hover:text-primary-600 truncate transition-colors text-sm">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {product.tagline}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="card h-full overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        {/* Cover zone */}
        <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="relative w-16 h-16 flex-shrink-0">
            {product.logo_url ? (
              <Image
                src={product.logo_url}
                alt={product.name}
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl font-bold text-gray-400">
                {product.name.charAt(0)}
              </div>
            )}
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {isNew(product.created_at) && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                新着
              </span>
            )}
            {product.pricing_type === "free" && (
              <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                無料
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPricingColor(product.pricing_type)}`}
            >
              {getPricingLabel(product.pricing_type)}
            </span>
            <svg
              className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
