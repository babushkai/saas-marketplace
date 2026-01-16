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
      <div className="card card-interactive p-5 h-full">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="relative w-14 h-14 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden ring-1 ring-gray-100">
            {product.logo_url ? (
              <Image
                src={product.logo_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                {product.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {product.tagline}
            </p>

            {/* Tags */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span
                className={`badge ${getPricingColor(product.pricing_type)}`}
              >
                {getPricingLabel(product.pricing_type)}
              </span>
              {product.price_info && (
                <span className="text-xs text-gray-400 font-medium">
                  {product.price_info}
                </span>
              )}
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
