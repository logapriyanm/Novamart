'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaStar,
    FaTruck,
    FaUndo,
    FaCheckCircle,
    FaMinus,
    FaPlus,
    FaShoppingCart,
    FaBolt,
    FaShieldAlt,
    FaChevronRight,
    FaHeart,
    FaRegHeart
} from 'react-icons/fa';
import { HiOutlineShieldCheck } from 'react-icons/hi';
import { useAuth } from '@/client/hooks/useAuth';
import { useCart } from '@/client/context/CartContext';
import { toast } from 'sonner';
import { productService } from '@/lib/api/services/product.service';
import Link from 'next/link';
import Loader from '@/client/components/ui/Loader';
import CustomerProductCard from '@/client/components/ui/CustomerProductCard';
import ReviewList from '@/client/components/features/reviews/ReviewList';

interface ProductClientProps {
    id: string;
    initialData?: any;
}

export default function ProductClient({ id, initialData }: ProductClientProps) {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(initialData || null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Description');
    const [isLoading, setIsLoading] = useState(!initialData);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Pre-select first options if available
    useEffect(() => {
        if (product) {
            if (product.colors?.length > 0 && !selectedColor) setSelectedColor(product.colors[0]);
            if (product.sizes?.length > 0 && !selectedSize) setSelectedSize(product.sizes[0]);
        }
    }, [product]);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) return;
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
                // Set initial variants only if not already set (re-fetch case)
                if (data.colors?.length > 0) setSelectedColor(prev => prev || data.colors[0]);
                if (data.sizes?.length > 0) setSelectedSize(prev => prev || data.sizes[0]);

                // Fetch related products (same category) for the bundle section
                const searchCategory = data.inventory?.[0]?.customCategory || data.category;
                if (searchCategory) {
                    const related = await productService.getAllProducts({
                        category: searchCategory,
                        limit: 4,
                        status: 'APPROVED'
                    });
                    const adaptedRelated = related.products
                        .filter((p: any) => p.id !== id)
                        .map((p: any) => ({
                            id: p.id,
                            inventoryId: p.inventory?.[0]?._id,
                            name: p.name,
                            price: p.inventory?.[0]?.price || p.basePrice,
                            originalPrice: p.inventory?.[0]?.originalPrice || p.basePrice,
                            image: p.images?.[0] || 'https://placehold.co/400x400?text=No+Image',
                            brand: p.manufacturer?.companyName || 'NovaMart',
                            spec: p.category,
                            subCategory: p.specifications?.subCategory,
                            rating: p.averageRating || 0,
                            reviewsCount: p.reviewCount || 0,
                            seller: {
                                id: p.inventory?.[0]?.sellerId?._id,
                                name: p.inventory?.[0]?.sellerId?.businessName || p.manufacturer?.companyName || 'Verified Seller',
                                isVerified: p.manufacturer?.isVerified || false
                            },
                            inStock: (p.inventory?.[0]?.stock || 0) > 0,
                            colors: p.colors || [],
                            sizes: p.sizes || [],
                            highlights: {
                                freeDelivery: p.basePrice > 2000,
                                installation: p.category?.toLowerCase() === 'machinery',
                                warranty: p.specifications?.warranty || '1 Year'
                            },
                            description: p.description,
                            stockStatus: (p.inventory?.[0]?.stock || 0) > 10 ? 'IN_STOCK' : (p.inventory?.[0]?.stock || 0) > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK'
                        }));

                    setRelatedProducts(adaptedRelated);
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
                toast.error('Failed to load product details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    const handleAction = async (action: 'cart' | 'buy') => {
        const inventory = product.inventory?.[0];
        if (!inventory) {
            toast.error('This product is currently unavailable');
            return;
        }

        // Validate variants
        if (product.colors?.length > 0 && !selectedColor) {
            toast.error('Please select a color');
            return;
        }
        if (product.sizes?.length > 0 && !selectedSize) {
            toast.error('Please select a size');
            return;
        }

        try {
            await addToCart({
                inventoryId: inventory.id,
                productId: product.id,
                name: displayProduct.name,
                price: parseFloat(inventory.price),
                image: displayProduct.images[0],
                quantity,
                sellerId: inventory.seller?.id,
                sellerName: inventory.seller?.businessName,
                region: inventory.region,
                stock: inventory.stock,
                color: selectedColor,
                size: selectedSize
            });

            if (action === 'buy') {
                router.push('/checkout');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to add item to cart');
        }
    };

    const inventory = product?.inventory?.[0];

    // Merge Seller Overrides
    const displayProduct = product ? {
        ...product,
        name: inventory?.customName || product.name,
        description: inventory?.customDescription || product.description,
        category: inventory?.customCategory || product.category,
        specifications: {
            ...product.specifications,
            ...(inventory?.customSpecifications || {})
        },
        images: (inventory?.customImages && inventory.customImages.length > 0)
            ? inventory.customImages
            : product.images,
        subCategory: inventory?.customSubCategory || product.subCategory
    } : null;

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center bg-white">
                <Loader size="lg" variant="primary" />
            </div>
        );
    }

    if (!displayProduct) {
        return (
            <div className="min-h-screen pt-32 text-center text-slate-500 bg-white">
                Product not found.
            </div>
        );
    }

    const primarySeller = product.inventory?.[0]?.seller;
    const stock = product.inventory?.[0]?.stock || 0;
    const currentPrice = parseFloat(product.inventory?.[0]?.price || product.basePrice);
    const discountPercent = product.basePrice > currentPrice
        ? Math.round(((product.basePrice - currentPrice) / product.basePrice) * 100)
        : 0;
    const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen pt-24 pb-20 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-6 sm:mb-8">
                    <Link href="/" className="hover:text-black transition-colors">Home</Link>
                    <span className="text-slate-200">/</span>
                    <Link href={`/products?cat=${displayProduct.category}`} className="hover:text-black transition-colors">{displayProduct.category}</Link>
                    <span className="text-slate-200">/</span>
                    <span className="text-black font-extrabold">{displayProduct.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
                    {/* LEFT: Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden flex items-center justify-center relative">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                src={displayProduct.images[selectedImage]}
                                alt={displayProduct.name}
                                className="w-full h-full object-contain p-6 sm:p-12"
                            />
                        </div>

                        {/* Thumbnails — hover to swap */}
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {displayProduct.images?.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onMouseEnter={() => setSelectedImage(idx)}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 flex-shrink-0 p-1.5 bg-[#f5f5f5] transition-all duration-200 ${selectedImage === idx
                                        ? 'border-black shadow-md'
                                        : 'border-transparent hover:border-slate-300'
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-contain" alt={`Thumbnail ${idx + 1}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Product Info */}
                    <div className="flex flex-col">
                        {/* Top row: Product Name + Seller Icon + Wishlist */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-black leading-tight tracking-tight">
                                {displayProduct.name}
                            </h1>
                            <div className="flex items-center gap-3 shrink-0">
                                {/* Seller Profile Icon */}
                                {primarySeller && (
                                    <Link
                                        href={`/sellers/${primarySeller.id}`}
                                        title={`Sold by ${primarySeller.businessName}`}
                                        className="relative group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-black transition-all">
                                            {primarySeller.profileImage ? (
                                                <img
                                                    src={primarySeller.profileImage}
                                                    alt={primarySeller.businessName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs font-black text-slate-400 uppercase">
                                                    {primarySeller.businessName?.substring(0, 2)}
                                                </span>
                                            )}
                                        </div>
                                        {/* Blue Verified Tick */}
                                        {primarySeller.isVerified && (
                                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                                <FaCheckCircle className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                    </Link>
                                )}
                                {/* Wishlist */}
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center hover:border-black transition-all"
                                >
                                    {isWishlisted
                                        ? <FaHeart className="w-4 h-4 text-red-500" />
                                        : <FaRegHeart className="w-4 h-4 text-slate-400" />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.averageRating || 0) ? 'text-amber-400' : 'text-slate-200'}`} />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-slate-400">
                                {product.averageRating?.toFixed(1) || '0.0'}/5 ({product.reviewCount || 0} Reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-3xl sm:text-4xl font-bold text-black tracking-tight">₹{currentPrice.toLocaleString()}.00</span>
                                {discountPercent > 0 && (
                                    <>
                                        <span className="text-lg text-slate-400 line-through font-medium">₹{product.basePrice.toLocaleString()}.00</span>
                                        <span className="bg-black text-white text-xs font-bold px-2.5 py-1 rounded-md">
                                            SAVE {discountPercent}%
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 font-medium">Inclusive of all taxes</p>
                        </div>

                        {/* Feature Icons Row */}
                        <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-slate-100">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                    <FaTruck className="w-4 h-4 text-black" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-black">FREE DELIVERY</p>
                                    <p className="text-[10px] text-slate-400 font-medium">By {deliveryDate}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                    <HiOutlineShieldCheck className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-black">1-YEAR WARRANTY</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Official Brand Cover</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                    <FaUndo className="w-3.5 h-3.5 text-black" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-black">7-DAY RETURN</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Hassle-Free Policy</p>
                                </div>
                            </div>
                        </div>

                        {/* Variants Section */}
                        <div className="space-y-5 mb-8">
                            {product.colors && product.colors.length > 0 && (
                                <div className="space-y-2.5">
                                    <span className="text-sm font-bold text-black">Select Color</span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map((color: string) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${selectedColor === color
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-slate-200 text-slate-600 hover:border-black/30'
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.sizes && product.sizes.length > 0 && (
                                <div className="space-y-2.5">
                                    <span className="text-sm font-bold text-black">Select Size</span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size: string) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-12 h-12 flex items-center justify-center border rounded-lg text-sm font-medium transition-all ${selectedSize === size
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-slate-200 text-slate-600 hover:border-black/30'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quantity + Add to Cart */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500"
                                >
                                    <FaMinus className="w-3 h-3" />
                                </button>
                                <span className="w-10 text-center text-sm font-bold text-black select-none">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                    className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500"
                                >
                                    <FaPlus className="w-3 h-3" />
                                </button>
                            </div>
                            <button
                                onClick={() => handleAction('cart')}
                                disabled={stock <= 0}
                                className="flex-1 h-11 bg-black text-white rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-black/90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FaShoppingCart className="w-3.5 h-3.5" />
                                ADD TO CART
                            </button>
                        </div>

                        {/* Buy Now */}
                        <button
                            onClick={() => handleAction('buy')}
                            disabled={stock <= 0}
                            className="w-full h-11 bg-white text-black border-2 border-black rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            BUY NOW
                        </button>

                        {/* Stock info */}
                        <p className="text-xs font-medium text-slate-400 mt-3">
                            {stock > 0 ? `${stock} items available` : 'Out of stock'}
                        </p>
                    </div>
                </div>

                {/* TABS SECTION */}
                <div className="border-t border-slate-100 pt-10">
                    <div className="flex justify-center border-b border-slate-100 mb-10">
                        {['Description', 'Specifications', `Reviews (${product.reviewCount || 0})`].map((tab) => {
                            const tabKey = tab.startsWith('Reviews') ? 'Reviews' : tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tabKey)}
                                    className={`px-6 sm:px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] relative transition-colors whitespace-nowrap ${activeTab === tabKey ? 'text-black' : 'text-slate-300 hover:text-slate-500'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tabKey && (
                                        <motion.div layoutId="activeTabProduct" className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="min-h-[300px] max-w-4xl mx-auto">
                        {activeTab === 'Description' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line text-center mb-12">
                                    {displayProduct.description}
                                </p>

                                {/* Feature highlights below description */}
                                {displayProduct.specifications && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8 max-w-3xl mx-auto">
                                        {Object.entries(displayProduct.specifications).slice(0, 4).map(([key, val]) => (
                                            <div key={key}>
                                                <h4 className="text-xs font-black text-black uppercase tracking-[0.15em] mb-2">{key}</h4>
                                                <p className="text-sm text-slate-500 leading-relaxed">{String(val)}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'Specifications' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
                                {displayProduct.specifications && Object.entries(displayProduct.specifications).map(([key, val]) => (
                                    <div key={key} className="flex items-center justify-between py-3.5 border-b border-slate-50 hover:bg-slate-50/50 px-3 rounded transition-colors">
                                        <span className="text-sm font-medium text-slate-400">{key}</span>
                                        <span className="text-sm font-bold text-black">{String(val)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'Reviews' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex flex-col md:flex-row gap-10">
                                    <div className="md:w-56 shrink-0 space-y-5">
                                        <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100">
                                            <p className="text-5xl font-bold text-black mb-2">{product.averageRating?.toFixed(1) || '0.0'}</p>
                                            <div className="flex justify-center gap-1 text-amber-400 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={`w-4 h-4 ${i < Math.round(product.averageRating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                            <p className="text-xs font-medium text-slate-400">{product.reviewCount || 0} Reviews</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (!isAuthenticated) {
                                                    router.push(`/auth/login?redirect=/products/${id}`);
                                                    return;
                                                }
                                                toast.info('Please select the item from your Orders to review.');
                                                router.push('/orders');
                                            }}
                                            className="w-full py-3 bg-black text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-black/90 transition-all"
                                        >
                                            Write a Review
                                        </button>
                                    </div>

                                    <div className="flex-1 space-y-8">
                                        <ReviewList type="PRODUCT" targetId={id} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 border-t border-slate-100 pt-16">
                        <div className="flex items-center gap-2 mb-8">
                            <FaBolt className="w-4 h-4 text-black" />
                            <h2 className="text-xl font-bold text-black uppercase tracking-tight">Similar Products</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(p => (
                                <CustomerProductCard key={p.id} {...p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
