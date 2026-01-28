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
          <div className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden ring-1 ring-gray-200 group-hover:ring-primary-200 transition-all">
            {product.logo_url ? (
              <Image
                src={product.logo_url}
                alt={product.name}
                fill
                className="object-contain p-1"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                {product.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
              {product.tagline}
            </p>

            <div className="flex items-center flex-wrap gap-2 mt-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPricingColor(product.pricing_type)}`}
              >
                {getPricingLabel(product.pricing_type)}
              </span>
              {product.price_info && (
                <span className="text-xs text-gray-500">
                  {product.price_info}
                </span>
              )}
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              className="w-5 h-5 text-primary-500"
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
