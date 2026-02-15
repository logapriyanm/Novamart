import React, { useEffect, useState } from 'react';
import CustomerProductCard from '@/client/components/ui/CustomerProductCard';
import { FilterState } from '@/client/components/features/products/ProductFilterSidebar';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { useCart } from '@/client/context/CartContext';
import { useWishlist } from '@/client/hooks/useWishlist';
import { FaStar, FaHeart, FaCheckCircle, FaShoppingCart, FaTruck } from 'react-icons/fa';
import OptimizedImage from '@/client/components/ui/OptimizedImage';

interface FeaturedProductsGridProps {
    columns?: number;
    filters?: FilterState;
    viewMode?: 'grid' | 'list';
    categorySlug?: string;
}

// Horizontal list-view card component
function ProductListCard({ product }: { product: any }) {
    const router = useRouter();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const isWishlisted = isInWishlist(product.id);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discount = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!product.inventoryId) {
            router.push(`/products/${product.id}`);
            return;
        }
        try {
            await addToCart({
                inventoryId: product.inventoryId,
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                sellerId: product.seller?.id || '',
                sellerName: product.seller?.name || '',
                stock: product.stock,
                originalPrice: product.originalPrice
            });
        } catch (error) {
            console.error("Add to cart failed", error);
        }
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleWishlist(product.id);
    };

    return (
        <div
            onClick={() => router.push(`/products/${product.id}`)}
            className="group bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
        >
            <div className="flex flex-col sm:flex-row">
                {/* Image Section */}
                <div className="relative w-full sm:w-56 md:w-64 shrink-0 aspect-square sm:aspect-auto sm:h-auto bg-slate-50 flex items-center justify-center p-4">
                    <OptimizedImage
                        src={product.image}
                        alt={product.name}
                        width={240}
                        height={240}
                        className="w-full h-full object-contain max-h-48 group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlist}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-slate-300 hover:text-slate-600 shadow-sm'}`}
                    >
                        <FaHeart className="w-4 h-4" />
                    </button>
                    {/* Verified Badge */}
                    {product.seller?.isVerified && (
                        <div className="absolute top-3 left-3 bg-white/90 rounded-full p-1.5 shadow-sm text-blue-500">
                            <FaCheckCircle className="w-3.5 h-3.5" />
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
                    <div>
                        {/* Product Name */}
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug line-clamp-2 mb-2 group-hover:text-black">
                            {product.name}
                        </h3>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                                {product.rating?.toFixed(1) || '0.0'} <FaStar className="w-2.5 h-2.5" />
                            </span>
                            <span className="text-sm text-slate-400 font-medium">
                                ({product.reviewsCount?.toLocaleString() || 0} reviews)
                            </span>
                        </div>

                        {/* Seller */}
                        <p className="text-sm text-slate-400 mb-3">
                            Sold by <span className="font-semibold text-slate-600">{product.seller?.name || 'Unknown'}</span>
                            {product.seller?.isVerified && (
                                <FaCheckCircle className="inline w-3 h-3 text-blue-500 ml-1" />
                            )}
                        </p>

                        {/* Highlights */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            {product.highlights?.freeDelivery && (
                                <span className="flex items-center gap-1 text-green-600 font-semibold">
                                    <FaTruck className="w-3 h-3" /> Free Delivery
                                </span>
                            )}
                            {product.highlights?.warranty && (
                                <span className="font-medium">{product.highlights.warranty}</span>
                            )}
                            {product.stock > 0 && product.stock < 10 && (
                                <span className="text-red-500 font-bold">Only {product.stock} left</span>
                            )}
                        </div>
                    </div>

                    {/* Price & Action Row */}
                    <div className="flex items-end justify-between mt-4 pt-3 border-t border-slate-50">
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl sm:text-2xl font-bold text-slate-900">
                                    ₹{product.price?.toLocaleString()}
                                </span>
                                {hasDiscount && (
                                    <>
                                        <span className="text-sm text-slate-400 line-through">
                                            ₹{product.originalPrice?.toLocaleString()}
                                        </span>
                                        <span className="text-sm font-bold text-green-600">
                                            {discount}% off
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all active:scale-[0.97] cursor-pointer"
                        >
                            <FaShoppingCart className="w-3.5 h-3.5" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FeaturedProductsGrid({ columns = 4, filters, viewMode = 'grid', categorySlug }: FeaturedProductsGridProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const gridClass = viewMode === 'list'
        ? "flex flex-col gap-4"
        : columns === 5
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

    useEffect(() => {
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
                }

                const res = await apiClient.get<any>('/products', { params });
                const productsArray = res.products || [];

                // Transform API data to Card props
                const transformed = productsArray.map((p: any) => ({
                    id: p.id,
                    name: p.inventory?.[0]?.customName || p.name,
                    price: parseFloat(p.inventory?.[0]?.price || p.basePrice),
                    originalPrice: parseFloat(p.basePrice),
                    image: (p.inventory?.[0]?.customImages?.length > 0 ? p.inventory[0].customImages[0] : p.images?.[0]) || '/placeholder.png',
                    rating: p.averageRating || 0,
                    reviewsCount: p.reviewCount || 0,
                    brand: p.manufacturer?.companyName || 'Generic',
                    stock: p.inventory?.[0]?.stock || 0,
                    seller: {
                        id: p.inventory?.[0]?.sellerId?._id || p.inventory?.[0]?.sellerId,
                        name: p.inventory?.[0]?.sellerId?.businessName || p.manufacturer?.companyName || 'Unknown Seller',
                        isVerified: p.manufacturer?.isVerified || false
                    },
                    highlights: {
                        freeDelivery: parseFloat(p.basePrice) > 2000,
                        installation: p.installationType ? true : false,
                        warranty: p.specifications?.warranty || 'Standard Warranty'
                    },
                    inventoryId: p.inventory?.[0]?.id || p.inventory?.[0]?._id
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
        return (
            <div className={viewMode === 'list' ? 'flex flex-col gap-4' : gridClass}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`animate-pulse bg-slate-100 rounded-xl ${viewMode === 'list' ? 'h-48' : 'aspect-[3/4]'}`} />
                ))}
            </div>
        );
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
                viewMode === 'list'
                    ? <ProductListCard key={product.id} product={product} />
                    : <CustomerProductCard key={product.id} {...product} />
            ))}
        </div>
    );
}

