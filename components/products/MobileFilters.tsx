"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { ProductFilters } from "@/components/products/ProductFilters";

interface MobileFiltersProps {
  selectedCategory: string;
  selectedPricing: string[];
}

export function MobileFilters({ selectedCategory, selectedPricing }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) + selectedPricing.length;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden btn btn-outline flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        フィルター
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary-600 text-white rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="フィルター"
        position="left"
      >
        <ProductFilters
          selectedCategory={selectedCategory}
          selectedPricing={selectedPricing}
        />
      </Drawer>
    </>
  );
}
