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
                // Fetch products with proper API response handling
                const response = await productService.getAllProducts({
                    status: 'APPROVED'
                });

                // Handle response - check if it's wrapped in ApiResponse or direct array
                const productsData = Array.isArray(response) ? response : (response as any)?.data || [];

                // Map to UI format - take first 8 products
                const featured = productsData.slice(0, 8).map((p: any) => {
                    // Get first inventory item for pricing
                    const firstInventory = p.inventory?.[0];
                    const price = firstInventory?.price || p.basePrice || 0;

                    return {
                        id: p.id,
                        name: p.name,
                        price: price,
                        image: p.images?.[0] || '/assets/placeholder-product.png',
                        rating: p.averageRating || 0,
                        brand: p.manufacturer?.companyName || 'NovaMart',
                        seller: {
                            name: p.manufacturer?.companyName || 'Verified Seller',
                            isVerified: p.manufacturer?.isVerified || false
                        },
                        highlights: {
                            freeDelivery: price > 1000,
                            installation: p.category?.toLowerCase().includes('machinery'),
                            warranty: p.specifications?.warranty || '6 Months'
                        }
                    };
                });

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
                        <div key={i} className="bg-white rounded-[10px] p-4 border border-foreground/5 animate-pulse h-96"></div>
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

