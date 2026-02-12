'use client';

import React from 'react';
import Link from 'next/link';
import {
    FaBlender,
    FaTshirt,
    FaSnowflake,
    FaTv,
    FaWind
} from 'react-icons/fa';

const iconMap: Record<string, any> = {
    'refrigerators': FaSnowflake,
    'washing-machines': FaTshirt,
    'air-conditioners': FaSnowflake,
    'kitchen-appliances': FaBlender,
    'home-comfort': FaWind,
};

interface CategoryGridProps {
    categories?: {
        title: string;
        slug: string;
        icon?: string;
        items: {
            name: string;
            image: string;
        }[];
    }[];
}

export default function CategoryGrid({ categories = [] }: CategoryGridProps) {
    // If no categories provided from CMS, we can either return null or show a placeholder.
    // Given the requirement is "data from database", we expect CMS to provide it.
    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 mt-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, idx) => {
                    const IconComponent = category.icon && iconMap[category.icon] ? iconMap[category.icon] : FaBlender;

                    return (
                        <div key={idx} className="bg-white rounded-[10px] p-6 border border-foreground/10 hover:border-black/20 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <IconComponent className="w-6 h-6 text-black" />
                                    <h3 className="text-sm font-black text-black uppercase">{category.title}</h3>
                                </div>
                                <Link href={`/products?cat=${category.slug}`} className="text-[10px] font-bold text-black uppercase hover:underline">View All</Link>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {category.items.map((item: any, itemIdx: number) => (
                                    <Link key={itemIdx} href={`/products?cat=${category.slug}`} className="flex flex-col gap-2 group/item">
                                        <div className="aspect-square rounded-[10px] bg-background overflow-hidden border border-foreground/5 group-hover/item:border-black/20 transition-colors">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                                        </div>
                                        <span className="text-[10px] font-bold text-foreground/60 leading-tight group-hover/item:text-black transition-colors truncate uppercase">
                                            {item.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
