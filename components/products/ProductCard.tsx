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
      <div className="card p-4 h-full hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            {product.logo_url ? (
              <Image
                src={product.logo_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                {product.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                {product.name}
              </h3>
              {product.is_verified && (
                <svg
                  className="w-4 h-4 text-blue-500 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-label="認証済み"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {product.tagline}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPricingColor(product.pricing_type)}`}
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
        </div>
      </div>
    </Link>
  );
}
