import React, { useEffect, useState } from 'react';
import CustomerProductCard from '@/client/components/ui/CustomerProductCard';
import { FilterState } from '@/client/components/features/products/ProductFilterSidebar';
import { apiClient } from '@/lib/api/client';

interface FeaturedProductsGridProps {
    columns?: number;
    filters?: FilterState;
    viewMode?: 'grid' | 'list';
    categorySlug?: string;
}

export default function FeaturedProductsGrid({ columns = 4, filters, viewMode = 'grid', categorySlug }: FeaturedProductsGridProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const gridClass = viewMode === 'list'
        ? "grid grid-cols-1 gap-6"
        : columns === 5
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

    useEffect(() => {
        // ... (fetch logic remains same) ...
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const params: any = {};

                if (categorySlug) {
                    params.category = categorySlug;
                }

                if (filters) {
                    if (filters.priceRange) {
                        params.minPrice = filters.priceRange[0];
                        params.maxPrice = filters.priceRange[1];
                    }
                    if (filters.brands?.length) params.brands = filters.brands.join(',');
                    if (filters.rating) params.rating = filters.rating;
                    if (filters.availability?.length) params.availability = filters.availability.join(',');
                    if (filters.verifiedOnly) params.verifiedOnly = 'true';

                    // Appliance Specs
                    if (filters.powerConsumption?.length) params.powerConsumption = filters.powerConsumption.join(',');
                    if (filters.capacity?.length) params.capacity = filters.capacity.join(',');
                    if (filters.energyRating?.length) params.energyRating = filters.energyRating.join(',');
                    if (filters.installationType?.length) params.installationType = filters.installationType.join(',');
                    if (filters.usageType?.length) params.usageType = filters.usageType.join(',');
                    if (filters.warranty?.length) params.warranty = filters.warranty.join(',');
                    if (filters.isSmart) params.isSmart = 'true';
                    if (filters.subCategory) params.subCategory = filters.subCategory;
                    // Note: Category slug is usually handled by the parent layout or route
                }

                // If on a category page, we might have categorySlug prop, but here it's implicit in filters or passed via useParams in parent
                // For global products page, it uses query params.

                const res = await apiClient.get<any>('/products', { params });
                const productsArray = res.products || [];

                // Transform API data to Card props
                const transformed = productsArray.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    price: parseFloat(p.basePrice), // Use base price or lowest inventory price
                    image: p.images?.[0] || '/placeholder.png', // Fallback
                    rating: p.averageRating || 0,
                    reviewsCount: p.reviewCount || 0,
                    brand: p.manufacturer?.companyName || 'Generic',
                    seller: {
                        name: p.manufacturer?.companyName || 'Unknown Seller',
                        isVerified: p.manufacturer?.isVerified || false
                    },
                    highlights: {
                        freeDelivery: true, // Mock for now or derive
                        installation: p.installationType ? true : false,
                        warranty: p.specifications?.warranty || 'Standard Warranty'
                    },
                    inventoryId: p.inventory?.[0]?.id // For add to cart
                }));

                setProducts(transformed);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters]);

    if (loading) {
        return <div className="py-20 text-center text-gray-500">Loading products...</div>;
    }

    if (error) {
        return <div className="py-20 text-center text-red-500">{error}</div>;
    }

    if (products.length === 0) {
        return <div className="py-20 text-center text-gray-400">No products found matching your criteria.</div>;
    }

    return (
        <div className={gridClass}>
            {products.map((product) => (
                <CustomerProductCard key={product.id} {...product} />
            ))}
        </div>
    );
}
