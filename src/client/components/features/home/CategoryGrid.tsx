'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FaBlender,
    FaTshirt,
    FaSnowflake,
    FaTv,
    FaWind
} from 'react-icons/fa';
import { apiClient } from '../../../../lib/api/client';

const iconMap: Record<string, any> = {
    'refrigerators': FaSnowflake,
    'washing-machines': FaTshirt,
    'air-conditioners': FaSnowflake,
    'kitchen-appliances': FaBlender,
    'home-comfort': FaWind,
};

import { useAuth } from '../../../context/AuthContext';

export default function CategoryGrid() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const isMounted = React.useRef(false);

    useEffect(() => {
        if (isMounted.current) return;
        isMounted.current = true;

        const fetchCategories = async () => {
            try {
                // Fetch products and extract unique categories
                const response = await apiClient.get<any>('/products', {
                    params: { status: 'APPROVED' }
                });

                const data = response.products || [];

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
                        <div key={i} className="bg-white rounded-[10px] p-6 border border-foreground/5 shadow-sm h-80 animate-pulse"></div>
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
                        <div key={idx} className="bg-white rounded-[10px] p-6 border border-foreground/10 hover:border-black/20 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <category.icon className="w-6 h-6 text-black" />
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
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholder / Demo Mode for Empty State */}
                    {[
                        {
                            title: 'Smart Cooling',
                            slug: 'air-conditioners',
                            icon: FaSnowflake,
                            items: [
                                { name: 'Inverter AC', image: 'https://images.unsplash.com/photo-1614631350868-e50eb9321487?auto=format&fit=crop&q=80&w=300' },
                                { name: 'Portable Cooler', image: 'https://images.unsplash.com/photo-1707269666072-a72049e54d3b?auto=format&fit=crop&q=80&w=300' }
                            ]
                        },
                        {
                            title: 'Kitchen Tech',
                            slug: 'kitchen-appliances',
                            icon: FaBlender,
                            items: [
                                { name: 'Smart Fridge', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=300' },
                                { name: 'Dishwasher', image: 'https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?auto=format&fit=crop&q=80&w=300' }
                            ]
                        },
                        {
                            title: 'Fabric Care',
                            slug: 'washing-machines',
                            icon: FaTshirt,
                            items: [
                                { name: 'Front Load', image: 'https://images.unsplash.com/photo-1626806775807-44563324ef71?auto=format&fit=crop&q=80&w=300' },
                                { name: 'Steam Iron', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=300' }
                            ]
                        },
                        {
                            title: 'Home Comfort',
                            slug: 'home-comfort',
                            icon: FaWind,
                            items: [
                                { name: 'Air Purifier', image: 'https://images.unsplash.com/photo-1585773690161-7b1cd0accfcf?auto=format&fit=crop&q=80&w=300' },
                                { name: 'Smart Fan', image: 'https://images.unsplash.com/photo-1618219944342-824e40a13285?auto=format&fit=crop&q=80&w=300' }
                            ]
                        }
                    ].map((category, idx) => (
                        <div key={idx} className="bg-white rounded-[10px] p-6 border border-foreground/10 hover:border-black/20 transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <category.icon className="w-6 h-6 text-black" />
                                    <h3 className="text-sm font-black text-black uppercase">{category.title}</h3>
                                </div>
                                <span className="text-[10px] font-bold text-foreground/40 uppercase">Coming Soon</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {category.items.map((item: any, itemIdx: number) => (
                                    <div key={itemIdx} className="flex flex-col gap-2 group/item cursor-not-allowed">
                                        <div className="aspect-square rounded-[10px] bg-background overflow-hidden border border-foreground/5 group-hover/item:border-black/20 transition-colors">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover/item:scale-110 transition-transform duration-500" />
                                        </div>
                                        <span className="text-[10px] font-bold text-foreground/40 leading-tight group-hover/item:text-black transition-colors truncate uppercase">
                                            {item.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
