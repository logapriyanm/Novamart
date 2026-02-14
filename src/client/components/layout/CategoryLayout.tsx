"use client";

import React, { useState } from "react";
import CategorySidebarLeft from "./CategorySidebarLeft";
import FeaturedProductsGrid from "../features/products/FeaturedProductsGrid";
import SpecialProductsList from "../features/products/SpecialProductsList";

import { FilterState } from "../features/products/ProductFilterSidebar";

interface CategoryLayoutProps {
  categorySlug: string;
}

export default function CategoryLayout({ categorySlug }: CategoryLayoutProps) {
  const categoryName = categorySlug
    ? categorySlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Category";

  // Lifted Filter State
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000],
    brands: [],
    rating: null,
    availability: [],
    verifiedOnly: false,
    subCategory: null,
    powerConsumption: [],
    capacity: [],
    energyRating: [],
    installationType: [],
    usageType: [],
    warranty: [],
    isSmart: false,
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-39 pb-0">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
        {/* Layout Container */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT SIDEBAR — Always visible, sticky, viewport-height scroll */}
          <aside className="hidden lg:block shrink-0 w-80 sticky top-[10rem] pb-8">
            <CategorySidebarLeft
              categorySlug={categorySlug}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    {categoryName}
                  </h2>
                  {filters.subCategory && (
                    <p className="text-sm font-medium text-primary mt-1">
                      Showing: {filters.subCategory}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {filters.subCategory && (
                  <button
                    onClick={() => handleFilterChange("subCategory", null)}
                    className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                  >
                    Clear: {filters.subCategory} ×
                  </button>
                )}

                {/* View Toggle Group */}
                <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
                  <button
                    onClick={() => handleFilterChange("viewMode", "grid")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      filters.viewMode !== "list"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "bg-transparent text-slate-400 hover:text-slate-600"
                    }`}
                    title="Grid View"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span>Grid</span>
                  </button>
                  <button
                    onClick={() => handleFilterChange("viewMode", "list")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      filters.viewMode === "list"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "bg-transparent text-slate-400 hover:text-slate-600"
                    }`}
                    title="List View"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    <span>List</span>
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="bg-white px-3 py-1.5 rounded-xl border border-foreground/5 shadow-sm hover:border-primary/30 transition-all flex items-center">
                  <select
                    className="bg-transparent text-sm font-bold outline-none text-foreground/80 cursor-pointer py-1 pr-1 text-center"
                    value={filters.sortBy || "relevance"}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                  >
                    <option value="relevance">Popularity</option>
                    <option value="price_asc">Cheapest</option>
                    <option value="price_desc">Premium</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            <section>
              {/* Section Title */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  Featured Products
                </h2>
              </div>
              <FeaturedProductsGrid
                columns={4}
                filters={filters}
                viewMode={filters.viewMode || "grid"}
                categorySlug={categorySlug}
              />
            </section>

            <section className="bg-surface rounded-[2.5rem] p-8 lg:p-12 border border-foreground/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Offer Products
                </h2>
              </div>
              <SpecialProductsList />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
