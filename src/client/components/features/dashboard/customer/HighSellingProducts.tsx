'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../../../lib/api/client';
import CustomerProductCard from '../../../ui/CustomerProductCard';
import { FaFire } from 'react-icons/fa';

export default function HighSellingProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHighSelling = async () => {
            try {
                // Fetch sorted by popularity (review count)
                const data = await apiClient.get<any[]>('/products', {
                    params: { sortBy: 'popularity' }
                });

                // transform and take top 8
                const transformed = data.slice(0, 8).map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    price: parseFloat(p.basePrice),
                    image: p.images?.[0] || '/placeholder.png',
                    rating: p.averageRating || 0,
                    reviewsCount: p.reviewCount || 0,
                    brand: p.manufacturer?.companyName || 'Generic',
                    seller: {
                        name: p.manufacturer?.companyName || 'Unknown Seller',
                        isVerified: p.manufacturer?.isVerified || false
                    },
                    highlights: {
                        freeDelivery: true,
                        installation: p.installationType ? true : false,
                        warranty: p.specifications?.warranty || 'Standard Warranty'
                    },
                    inventoryId: p.inventory?.[0]?.id
                }));

                setProducts(transformed);
            } catch (error) {
                console.error('Failed to fetch high selling products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHighSelling();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center text-slate-400">Loading top products...</div>;
    if (products.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <FaFire className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-[#1E293B]">High Selling Products</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Most popular choices this week</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <CustomerProductCard key={product.id} {...product} />
                ))}
            </div>
        </div>
    );
}
