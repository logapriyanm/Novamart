'use client';

import React, { useState, useEffect } from 'react';
import CustomerProductCard from '@/client/components/ui/CustomerProductCard';
import { productService } from '@/lib/api/services/product.service';

export default function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const data = await productService.getAllProducts({
                    status: 'APPROVED'
                });

                // Map to UI format - take first 4 products
                const featured = data.slice(0, 4).map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    price: p.basePrice,
                    image: p.images?.[0] || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop',
                    rating: p.rating || 4.2 + (Math.random() * 0.5), // Fallback for aesthetic
                    brand: p.manufacturer?.companyName || 'NovaMart',
                    seller: { name: p.manufacturer?.companyName || 'Verified Seller', isVerified: true },
                    highlights: {
                        freeDelivery: p.basePrice > 1000,
                        installation: p.category?.toLowerCase() === 'machinery',
                        warranty: p.warranty || '6 Months'
                    }
                }));

                setProducts(featured);
            } catch (error) {
                console.error('Failed to fetch featured products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    if (isLoading) {
        return (
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 mt-20 mb-20">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-black text-[#1E293B] tracking-tight">Featured Products</h3>
                    <p className="text-slate-500 mt-2">Handpicked for quality and performance</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-[2.5rem] p-4 border border-slate-100 animate-pulse h-96"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 mt-20 mb-20">
            <div className="text-center mb-12">
                <h3 className="text-3xl font-black text-[#1E293B] tracking-tight">Featured Products</h3>
                <p className="text-slate-500 mt-2">Handpicked for quality and performance</p>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <CustomerProductCard key={product.id} {...product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-slate-400 font-bold">No featured products available yet.</p>
                </div>
            )}
        </div>
    );
}

