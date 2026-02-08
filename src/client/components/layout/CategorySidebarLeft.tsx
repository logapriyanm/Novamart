import React from 'react';
import { FaChevronRight, FaEnvelope } from 'react-icons/fa';
import { categorySubcategories } from '../../data/categoryData';
import { ProductFilterSidebar, FilterState } from '../features/products/ProductFilterSidebar';

interface CategorySidebarLeftProps {
    categorySlug?: string;
    filters?: FilterState;
    onFilterChange?: (key: keyof FilterState, value: any) => void;
}

export default function CategorySidebarLeft({ categorySlug, filters, onFilterChange }: CategorySidebarLeftProps) {
    const subCategories = categorySlug ? categorySubcategories[categorySlug] : [];

    return (
        <div className="space-y-8">
            {/* Categories Navigation (Kept as per context, but enhanced or kept simple) */}
            <div className="bg-surface rounded-3xl p-6 border border-foreground/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-primary">Sub-Categories</h3>
                <ul className="space-y-1">
                    {(subCategories || []).map((item) => (
                        <li key={item}>
                            <button className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-background text-sm font-bold text-foreground/70 hover:text-foreground transition-all group">
                                {item}
                                <FaChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-all" />
                            </button>
                        </li>
                    ))}
                    {!subCategories && <p className="text-xs text-foreground/40 italic pl-3">No categories found.</p>}
                </ul>
            </div>

            {/* PRODUCT FILTERS (New Integration) */}
            {filters && onFilterChange && (
                <ProductFilterSidebar
                    filters={filters}
                    onFilterChange={onFilterChange}
                />
            )}

            {/* Newsletter (Optional: Kept below filters if needed or removed) */}
            <div className="bg-primary rounded-[2.5rem] p-8 text-background">
                <div className="w-12 h-12 bg-background/20 rounded-2xl flex items-center justify-center mb-6">
                    <FaEnvelope className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-2 leading-none">Newsletter</h3>
                <p className="text-xs font-bold opacity-60 mb-6 tracking-wide">Get latest updates about our latest shop and special offers.</p>
                <div className="space-y-3">
                    <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full bg-background/10 border border-background/20 rounded-xl px-4 py-3 text-xs font-bold placeholder:text-background/40 focus:outline-none focus:bg-background/20 transition-all"
                    />
                    <button className="w-full py-4 bg-background text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
}
