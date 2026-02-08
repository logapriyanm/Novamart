'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FaBlender,
    FaTshirt,
    FaSnowflake,
    FaTv
} from 'react-icons/fa';
import { apiClient } from '../../../../lib/api/client';

const iconMap: Record<string, any> = {
    kitchen: FaBlender,
    laundry: FaTshirt,
    cooling: FaSnowflake,
    entertainment: FaTv
};

export default function CategoryGrid() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch products and extract unique categories
                const data = await apiClient.get<any[]>('/products', {
                    params: { status: 'APPROVED' }
                });

                // Group products by category
                const categoryMap = new Map();
                data.forEach((product: any) => {
                    const category = product.category;
                    if (!categoryMap.has(category)) {
                        categoryMap.set(category, []);
                    }
                    categoryMap.get(category).push({
                        name: product.name,
                        image: product.images?.[0] || 'https://images.unsplash.com/photo-1571175449180-f8b4d0201d9f?q=80&w=200&auto=format&fit=crop'
                    });
                });

                // Convert to UI format (take up to 4 products per category)
                const formattedCategories = Array.from(categoryMap.entries()).slice(0, 4).map(([category, items]: [string, any]) => ({
                    title: category.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                    slug: category,
                    icon: iconMap[category] || FaBlender,
                    items: items.slice(0, 4)
                }));

                setCategories(formattedCategories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 mt-12 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-surface rounded-3xl p-6 shadow-xl shadow-primary/5 border border-foreground/5 h-80 animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 mt-12 mb-12">
            {categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, idx) => (
                        <div key={idx} className="bg-surface rounded-3xl p-6 shadow-xl shadow-primary/5 border border-foreground/5 hover:translate-y-px transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <category.icon className="w-6 h-6 text-foreground" />
                                    <h3 className="text-sm font-black text-foreground">{category.title}</h3>
                                </div>
                                <Link href={`/products?cat=${category.slug}`} className="text-[10px] font-bold text-primary hover:underline">View All</Link>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {category.items.map((item: any, itemIdx: number) => (
                                    <Link key={itemIdx} href={`/products?cat=${category.slug}`} className="flex flex-col gap-2 group/item">
                                        <div className="aspect-square rounded-2xl bg-background overflow-hidden border border-foreground/5 group-hover/item:border-primary/30 transition-colors">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                                        </div>
                                        <span className="text-[10px] font-bold text-foreground/60 leading-tight group-hover/item:text-primary transition-colors truncate">
                                            {item.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-slate-400 font-bold">No categories available yet.</p>
                </div>
            )}
        </div>
    );
}

