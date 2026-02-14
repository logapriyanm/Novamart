import React from "react";
import { categorySubcategories } from "../../data/categoryData";
import {
  ProductFilterSidebar,
  FilterState,
} from "../features/products/ProductFilterSidebar";

interface CategorySidebarLeftProps {
  categorySlug?: string;
  filters?: FilterState;
  onFilterChange?: (key: keyof FilterState, value: any) => void;
}

export default function CategorySidebarLeft({
  categorySlug,
  filters,
  onFilterChange,
}: CategorySidebarLeftProps) {
  const subCategories = categorySlug ? categorySubcategories[categorySlug] : [];

  return (
    <div className="space-y-8">
      {/* Sub-Categories — styled to match Advanced Filters */}
      <div className="bg-white border border-slate-200 rounded-[10px] shadow-sm flex flex-col divide-y divide-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 xs:p-5 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">Sub-Categories</h3>
        </div>

        {/* List */}
        <div className="p-4 xs:p-5">
          <ul className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {subCategories && (
              <li>
                <button
                  onClick={() => onFilterChange?.("subCategory", null)}
                  className={`w-full flex items-center justify-between py-2.5 px-3 rounded-[8px] transition-all text-left text-sm font-semibold ${!filters?.subCategory ? "bg-black text-white" : "hover:bg-slate-50 text-slate-600"}`}
                >
                  All Products
                </button>
              </li>
            )}
            {(subCategories || []).map((item) => (
              <li key={item}>
                <button
                  onClick={() => onFilterChange?.("subCategory", item)}
                  className={`w-full flex items-center justify-between py-2.5 px-3 rounded-[8px] transition-all text-left text-sm font-semibold ${filters?.subCategory === item ? "bg-black text-white" : "hover:bg-slate-50 text-slate-600"}`}
                >
                  {item}
                </button>
              </li>
            ))}
            {(!subCategories || subCategories.length === 0) && (
              <p className="text-sm text-slate-400 py-2 pl-3 italic">
                No sub-categories found.
              </p>
            )}
          </ul>
        </div>
      </div>

      {/* PRODUCT FILTERS */}
      {filters && onFilterChange && (
        <ProductFilterSidebar
          filters={filters}
          onFilterChange={onFilterChange}
        />
      )}
    </div>
  );
}
