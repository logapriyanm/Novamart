'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowRight, FaShoppingCart } from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

export default function RecentProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetching distinct products to simulate "Recently Viewed" or just "New Arrivals"
                // Ideally this endpoints supports ?limit=4&sort=createdAt:desc
                const response = await apiClient.get<any>('/products');
                // Handle response structure which might be { data: [], meta: ... } or just []
                const allProducts = Array.isArray(response) ? response : (response?.data || []);

                // Shuffle or take first 4 to show variety
                const displayProducts = allProducts.slice(0, 4);
                setProducts(displayProducts);
            } catch (err) {
                console.error('Failed to fetch recent products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-slate-100 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white p-4 rounded-[10px] shadow-sm border border-slate-100 h-64 animate-pulse">
                            <div className="h-40 bg-slate-100 rounded-[10px] mb-4" />
                            <div className="h-4 w-3/4 bg-slate-100 rounded mb-2" />
                            <div className="h-4 w-1/2 bg-slate-100 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#1E293B]">Suggested For You</h2>
                <Link href="/products" className="flex items-center gap-2 text-xs font-black text-[#0F6CBD] uppercase tracking-wider hover:underline">
                    View All <FaArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white p-4 rounded-[10px] shadow-sm border border-slate-100 group hover:shadow-md transition-all">
                        <div className="aspect-square bg-slate-50 rounded-[10px] mb-4 overflow-hidden relative">
                            {product.images && product.images[0] ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="space-y-1 mb-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category?.name || 'Product'}</p>
                            <h3 className="text-sm font-black text-[#1E293B] line-clamp-1" title={product.name}>{product.name}</h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-black text-[#0F6CBD]">₹{Number(product.price).toLocaleString()}</p>
                            <button
                                onClick={() => router.push(`/products/${product.id}`)}
                                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#1E293B] hover:bg-[#1E293B] hover:text-white transition-colors"
                            >
                                <FaShoppingCart className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
